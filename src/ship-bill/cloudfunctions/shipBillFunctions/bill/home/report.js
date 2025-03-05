const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let billCol = db.collection('bills');
  let openid = wxctx.getOpenId();

  const _ = db.command
  let res = await billCol.where(
    _.and([{
      openid: openid
    }, {
      createTime: _.gte(event.data.begin)
    }, {
      createTime: _.lte(event.data.end)
    }])
  ).get();


  // 获取起止事件内的每一天
  let dateList = [];
  var timeZoneDiff = 8; // 目标时区(北京时区)，GMT+8
  var offsetTime = new Date().getTimezoneOffset(); // 本地时间和UTC0时的时间差，单位为分钟
  let startTime = new Date(event.data.begin + offsetTime * 60 * 1000 + timeZoneDiff * 60 * 60 * 1000);
  let endTime = new Date(event.data.end + offsetTime * 60 * 1000 + timeZoneDiff * 60 * 60 * 1000);
  console.log('时间戳', startTime, endTime)
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var year = startTime.getFullYear();
    var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
    var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
    dateList.push(year + "-" + month + "-" + day);
    startTime.setDate(startTime.getDate() + 1);
  }
  // console.log(dateList);
  // console.log(new Date('2025-03-05').valueOf(), new Date('2025-03-05 23:59:59').valueOf());

  let reports = [];
  let bills = res?.data;
  if (!bills) return reports;

  dateList.map(d => {
    let begin = new Date(d).valueOf();
    let end = new Date(d + ' 23:59:59').valueOf();
    let expend = 0;
    let income = 0;
    bills.map(b => {
      if (b.createTime >= begin && b.createTime <= end) {
        if (b.type === 1) {
          expend += b.amount;
        } else if (b.type === 2) {
          income += b.amount;
        }
      }
    })

    reports.push({
      date: d,
      expend,
      income
    })
  })

  return reports;
};

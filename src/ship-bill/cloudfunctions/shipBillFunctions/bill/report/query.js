const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let openid = wxctx.getOpenId();

  let billCol = db.collection('bills');
  const _ = db.command
  let wheres = [{
    openid: openid
  }, {
    date: _.gte(event.data.begin)
  }, {
    date: _.lte(event.data.end)
  }];
  if (event.data.type !== 0) {
    wheres.push({
      type: event.data.type
    })
  }

  let res = await billCol.where(
    _.and(wheres)
  ).orderBy('date', 'desc').orderBy('createTime', 'desc').get();

  // 获取起止事件内的每一天
  let dateList = [];
  let startTime = new Date(event.data.begin);
  let endTime = new Date(event.data.end);
  // console.log('时间戳', startTime, endTime)
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var year = startTime.getFullYear();
    var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
    var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
    dateList.push(year + "-" + month + "-" + day);
    startTime.setDate(startTime.getDate() + 1);
  }

  let reports = [];
  // 构建汇总字段
  let summary = {};
  event.data.headers.forEach(h => {
    if (!h.ignoreSummary)
      summary[h.prop] = 0;
  });
  let bills = res?.data ?? [];

  dateList.forEach(d => {
    let begin = new Date(d + ' 00:00:00').valueOf();
    let end = new Date(d + ' 23:59:59').valueOf();

    let item = {
      date: d,
      address: '',
      counter: '',
      subCounter: '',
      oilTotal: 0,
      oilAmount: 0,
      outputValue: 0,
      commission: 0,
      remark: '',
    }

    let amount = 0;
    let addresses = [];
    let counters = [];
    let subCounters = [];
    let remarks = [];

    bills.map(b => {
      if (b.date >= begin && b.date <= end) {
        amount += b.amount;
        if (b.address && b.address.length > 0)
          addresses.push(b.address);
        if (b.counter && b.counter.length > 0)
          counters.push(b.counter);
        if (b.subCounter && b.subCounter.length > 0)
          subCounters.push(b.subCounter);
        if (b.remark && b.remark.length > 0)
          remarks.push(b.remark);
        if (b.type === 1) {
          item.oilTotal += b.total;
          item.oilAmount += b.total * b.rates;
        } else if (b.type === 2) {
          item.outputValue += b.total;
          item.commission += b.total * b.rates * 0.01; // 提成按百分比算
        }

        if (b.categories && b.categories.length > 0) {
          b.categories.map(bc => {
            const p = 'prop_' + bc.categoryId;
            if (item.hasOwnProperty(p)) {
              item[p] += bc.total;
            } else {
              item[p] = bc.total;
            }
          });
        }
      }
    });

    item.oilAmount = parseFloat((item.oilAmount).toFixed(2));
    item.commission = parseFloat((item.commission).toFixed(2));
    item.address = addresses.join('\n');
    item.counter = counters.join('\n');
    item.subCounter = subCounters.join('\n');
    item.remark = remarks.join('\n');

    if (amount > 0) {
      reports.push(item)
    }
  });

  reports.map(b => {
    // 构建汇总数据
    Object.keys(summary).forEach(key => {
      const value = b[key] === undefined ? 0 : b[key];
      summary[key] = parseFloat((summary[key] + value).toFixed(2));
    });
  });


  return {
    reports,
    summary
  };
};

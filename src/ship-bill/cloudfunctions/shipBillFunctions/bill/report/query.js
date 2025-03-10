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
  let bills = res?.data ?? [];


  dateList.forEach(d => {
    let begin = new Date(d + ' 00:00:00').valueOf();
    let end = new Date(d + ' 23:59:59').valueOf();

    let item = {
      date: d,
      bang: 0,
      fengGui: 0,
      yiTi: 0,
      jiaBan: 0,
      chaoShi: 0,
      buTie: 0,
      yaYe: 0,
      chaoZhong: 0,
      tiKong: 0,
      tiZhong: 0,
      haunKong: 0,
      haunZhong: 0,
      duGui: 0,
      tingChe: 0,
      gaoSu: 0,
      naioSu: 0,
      tiGui: 0,
      xiGui: 0,
      huanGui: 0,
      yanHuanGui: 0,
      xiuXiang: 0,
      buTai: 0,
      diaoGui: 0,
      daDan: 0,
      fengTiao: 0,
      xunGui: 0,
      xiuChe: 0,
      other: 0,
      oilTotal: 0,
      oilAmount: 0,
      outputValue: 0,
      commission: 0,
    }

    bills.map(b => {
      if (b.date >= begin && b.date <= end) {
        if (b.categorys && b.categorys.length > 0) {
          if (b.type === 1) {
            b.categorys.map(bc => {
              switch (bc.name) {
                case '渡柜':
                  item.duGui += bc.total
                  break;
                case '停车费':
                  item.tingChe += bc.total
                  break;
                case '高速费':
                  item.gaoSu += bc.total
                  break;
                case '尿素':
                  item.naioSu += bc.total
                  break;
                case '提柜费':
                  item.tiGui += bc.total
                  break;
                case '洗柜费':
                  item.xiGui += bc.total
                  break;
                case '换柜费':
                  item.huanGui += bc.total
                  break;
                case '验还柜':
                  item.yanHuanGui += bc.total
                  break;
                case '修箱费':
                  item.xiuXiang += bc.total
                  break;
                case '补胎':
                  item.buTai += bc.total
                  break;
                case '吊柜费':
                  item.diaoGui += bc.total
                  break;
                case '打单费':
                  item.daDan += bc.total
                  break;
                case '封条费':
                  item.fengTiao += bc.total
                  break;
                case '薰柜费':
                  item.xunGui += bc.total
                  break;
                case '修车费':
                  item.xiuChe += bc.total
                  break;
                default:
                  item.other += bc.total
                  break;
              }
            });

            item.oilTotal += b.total;
            item.oilAmount += b.total * b.rates;
          } else if (b.type === 2) {
            b.categorys.map(bc => {
              switch (bc.name) {
                case '磅费':
                  item.bang += bc.total
                  break;
                case '封柜费':
                  item.fengGui += bc.total
                  break;
                case '异提费':
                  item.yiTi += bc.total
                  break;
                case '加班':
                  item.jiaBan += bc.total
                  break;
                case '超时费':
                  item.chaoShi += bc.total
                  break;
                case '补贴':
                  item.buTie += bc.total
                  break;
                case '压夜':
                  item.yaYe += bc.total
                  break;
                case '超重费':
                  item.chaoZhong += bc.total
                  break;
                case '提空':
                  item.tiKong += bc.total
                  break;
                case '提重':
                  item.tiZhong += bc.total
                  break;
                case '还空':
                  item.haunKong += bc.total
                  break;
                case '还重':
                  item.haunZhong += bc.total
                  break;
                default:
                  item.other += bc.total
                  break;
              }
            });

            item.outputValue += b.total;
            item.commission += b.total * b.rates;
          }
        }
      }
    });
    item.oilAmount = parseFloat((item.oilAmount).toFixed(2));
    item.commission = parseFloat((item.commission).toFixed(2));
    reports.push(item)
  });

  return reports;
};

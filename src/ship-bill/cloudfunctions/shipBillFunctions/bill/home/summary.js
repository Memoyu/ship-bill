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
  let res = await billCol.where(
    _.and([{
      openid: openid
    }, {
      createTime: _.gte(event.data.begin)
    }, {
      createTime: _.lte(event.data.end)
    }])
  ).get();

  let summary = {
    expend: 0,
    income: 0,
    oilQuantity: 0,
    oilCost: 0,
    outputValue: 0
  }
  let bills = res?.data;
  if (!bills) return summary;

  bills.map(b => {
    if (b.type === 1) {
      summary.expend += b.amount;
      if (b.fee != 0) {
        summary.oilQuantity += b.fee;
        summary.oilCost += b.fee * b.rates;
      }
    } else if (b.type === 2) {
      summary.income += b.amount;
      if (b.fee != 0) {
        summary.outputValue += b.fee * b.rates;
      }
    }
  })

  return summary;
};

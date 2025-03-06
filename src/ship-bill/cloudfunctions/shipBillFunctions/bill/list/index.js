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
    createTime: _.gte(event.data.begin)
  }, {
    createTime: _.lte(event.data.end)
  }];
  if (event.data.type !== 0) {
    wheres.push({
      type: event.data.type
    })
  }

  let res = await billCol.where(
    _.and(wheres)
  ).get();

  let income = 0;
  let expend = 0;
  let items = res?.data ?? [];

  items.forEach(i => {
    if (i.type === 1) {
      expend += i.amount;
    } else if (i.type === 2) {
      income += i.amount;
    }
  });


  return {
    items,
    income,
    expend
  };
};

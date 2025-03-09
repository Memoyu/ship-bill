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

  let result = [];
  let items = res?.data ?? [];

  items.forEach(i => {

  });

  return result;
};

const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const type = event.data;
  const _ = db.command
  let categoryCol = db.collection('categories');
  let openid = wxctx.getOpenId();
  if (type === 0) {
    return (await categoryCol.where(
      _.or([{
        openid: openid
      }, {
        base: true
      }])
    ).get()).data;
  } else {
    return (await categoryCol.where(
      _.and([{
        type: type
      }, _.or([{
        openid: openid
      }, {
        base: true
      }])])
    ).get()).data;
  }

};

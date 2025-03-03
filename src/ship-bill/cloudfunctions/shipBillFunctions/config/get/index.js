const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let openid = wxctx.getOpenId();

  let configs = await db.collection('config').where({
    openid: openid
  }).get();

  if (configs.data && configs.data.length > 0) {
    return configs.data[0];
  }

  return {};
};

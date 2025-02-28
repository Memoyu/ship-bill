const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

function getOpenId() {
  const wxContext = cloud.getWXContext();
  return wxContext.OPENID;
}

module.exports = {
  getOpenId: getOpenId
}
const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  if (!data) throw new Error("用户数据不能为空");
  let usersCol = db.collection('users');
  let openid = wxctx.getOpenId();
  if (!openid) throw new Error("用户openid获取失败");

  let users = await usersCol.where({
    openid: openid
  }).get();
  if (users.data && users.data.length > 0) return users.data[0];

  let res = await usersCol.add({
    data
  });
  data._id = res._id;

  return data;
};

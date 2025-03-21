const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  if (!data) throw new Error("用户数据不能为空");
  if (!data._id) throw new Error("用户id不能为空");

  const _ = db.command
  let usersCol = db.collection('users');
  let users = await usersCol.where({
    _id: data._id
  }).get();
  if (!users.data || users.data.length < 1) throw new Error("用户不存在");
  let user = users.data[0];

  delete data._id;
  delete data.openid;

  data.updateTime = Date.now();
  let res = await usersCol.doc(user._id).update({
    data
  });

  return {
    ...user,
    ...data
  };

};

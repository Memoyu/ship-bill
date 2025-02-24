const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    let data = event.data;
    if (!data) throw new Error("用户数据不能为空");
    let usersCol = db.collection('users');
    let id = data._id;
    if (!id) throw new Error("用户id不能为空");

    let users = await usersCol.where({
      _id: id
    }).get();
    if (!users.data || users.data.length < 1) throw new Error("用户不存在");

    let res = await usersCol.where({
      _id: id
    }).update({
      data
    });
    data._id = res._id;

    return data;
  } catch (e) {
    return {
      success: false,
      errMsg: e.message
    };
  }
};
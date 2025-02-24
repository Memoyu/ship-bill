const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    let userid = event.data;
    if (!userid) throw new Error("用户id不能为空");

    let users = await usersCol.where({
      _id: userid
    }).get();
    if (users.data && users.data.length > 0) {
      return users.data[0];
    } else {
      throw new Error("用户不存在");
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
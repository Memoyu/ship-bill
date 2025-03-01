const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const _ = db.command
  let userid = event.data;
  if (!userid) throw new Error("用户id/openid不能为空");

  let users = await db.collection('users').where(
    _.or([{
      _id: userid
    }, {
      openid: userid
    }])
  ).get();
  if (users.data && users.data.length > 0) {
    return users.data[0];
  } else {
    throw new Error("用户不存在");
  }
};

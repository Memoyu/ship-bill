const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  if (!data) throw new Error("账单数据不能为空");
  let openid = wxctx.getOpenId();
  if (!openid) throw new Error("用户openid获取失败");

  let billCol = db.collection('bills');

  data.openid = openid;
  data.updateTime = Date.now();
  data.createTime = Date.now();
  let res = await billCol.add({
    data
  });
  data._id = res._id;

  return data;
};

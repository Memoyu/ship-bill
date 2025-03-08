const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  if (!event.data) throw new Error("账单id不能为空");

  let billCol = db.collection('bills');
  let res = await billCol.doc(event.data).get();
  if (res.data) {
    return res.data;
  } else {
    throw new Error("账单不存在");
  }
};

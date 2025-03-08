const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  if (!data) throw new Error("账单数据不能为空");
  if (!data._id) throw new Error("账单id不能为空");
  if (!data.amount || data.amount <= 0) throw new Error("账单总额不能为0");
  if (!data.date || data.date <= 0) throw new Error("账单日期不能为空");

  let billCol = db.collection('bills');
  let billRes = await billCol.doc(data._id).get();
  const bill = billRes.data;
  if (!bill) {
    throw new Error("账单不存在");
  }

  delete data._id;
  delete data.openid;

  data.updateTime = Date.now();
  let res = await billCol.doc(bill._id).update({
    data
  });

  return {
    ...bill,
    ...data
  };
};

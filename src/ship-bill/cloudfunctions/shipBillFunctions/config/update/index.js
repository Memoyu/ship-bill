const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  let openid = wxctx.getOpenId();
  const id = data._id;

  let configCol = db.collection('config');
  delete data._id;
  if (id) {
    // 更新
    let config = await configCol.doc(id).get();
    if (config.data) {
      delete data.openid;

      data.updateTime = Date.now();
      let res = await configCol.doc(id).update({
        data
      });
    }
  } else {
    // 插入
    data.openid = openid;
    data.updateTime = Date.now();
    data.createTime = Date.now();
    let res = await configCol.add({
      data
    });
    data._id = res._id;
  }

  return data;
};

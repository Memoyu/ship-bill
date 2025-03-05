const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  if (!data) throw new Error("分类数据不能为空");
  let openid = wxctx.getOpenId();
  if (!openid) throw new Error("用户openid获取失败");

  if (!data.name || data.name.length < 1) throw new Error("分类名称不能为空");

  const _ = db.command
  let categoryCol = db.collection('categories');
  let categories = await categoryCol.where(
    _.and([{
      name: data.name
    }, _.or([{
      openid: openid
    }, {
      base: true
    }])])
  ).get();

  if (categories.data && categories.data.length > 0) throw new Error("同名分类已存在");

  data.openid = openid;
  data.base = false;
  data.updateTime = Date.now();
  data.createTime = Date.now();
  let res = await categoryCol.add({
    data
  });
  data._id = res._id;

  return data;
};

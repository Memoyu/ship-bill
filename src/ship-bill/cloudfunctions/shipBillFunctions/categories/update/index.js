const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  if (!data) throw new Error("分类数据不能为空");
  if (!data._id) throw new Error("分类id不能为空");
  if (!data.name || data.name.length < 1) throw new Error("分类名称不能为空");

  const id = data._id;
  const _ = db.command
  let categoryCol = db.collection('categories');

  let category = (await categoryCol.doc(id).get()).data;
  if (!category) throw new Error("分类不存在");

  let openid = wxctx.getOpenId();

  let categories = await categoryCol.where(_.and([{
    name: data.name
  }, _.or([{
    openid: openid
  }, {
    base: true
  }])])).get();

  if (categories.data && categories.data.length > 0 && categories.data[0]._id !== data._id)
    throw new Error("同名分类已存在");

  delete data._id;
  delete data.openid;

  data.updateTime = Date.now();
  let res = await categoryCol.doc(id).update({
    data
  });

  return {
    ...category,
    ...data
  };

};

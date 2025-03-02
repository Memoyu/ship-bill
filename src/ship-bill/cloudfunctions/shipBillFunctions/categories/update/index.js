const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  if (!data) throw new Error("分类数据不能为空");
  if (!data._id) throw new Error("分类id不能为空");
  if (!data.name || data.name.length < 1) throw new Error("分类名称不能为空");

  let categoryCol = db.collection('categories');
  let categories = await categoryCol.where({
    openid: openid,
    name: data.name
  }).get();

  if (categories.data && categories.data.length > 0 && categories.data[0]._id !== data._id)
    throw new Error("同名分类已存在");
  let category = categories.data[0];

  delete data._id;
  delete data.openid;

  data.updateTime = Date.now();
  let res = await categoryCol.doc(category._id).add({
    data
  });

  return {
    ...category,
    ...data
  };

};

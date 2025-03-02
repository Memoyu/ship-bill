const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let data = event.data;
  const id = data._id;
  if (!id) throw new Error("分类id不能为空");

  let categoryCol = db.collection('categories');

  let category = (await categoryCol.doc(id).get()).data;
  if (!category) throw new Error("分类不存在");
  if (category.base) throw new Error("预设分类不能删除");

  let res = await categoryCol.doc(id).remove();

  return category;
};

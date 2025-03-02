// 云函数入口文件
const cloud = require('wx-server-sdk')

const createUser = require('./user/create/index');
const updateUser = require('./user/update/index');
const getOpenId = require('./user/openid/index');
const getUser = require('./user/get/index');

const getCategories = require('./categories/list/index');
const createCategory = require('./categories/create/index');
const updateCategory = require('./categories/update/index');
const deleteCategory = require('./categories/delete/index');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const mapUser = async (event, context) => {
  switch (event.method) {
    case 'create':
      return await createUser.main(event, context);
    case 'update':
      return await updateUser.main(event, context);
    case 'openid':
      return await getOpenId.main(event, context);
    case 'get':
      return await getUser.main(event, context);
    default:
      throw new Error("未定义method");
  }
}

const mapCategory = async (event, context) => {
  switch (event.method) {
    case 'list':
      return await getCategories.main(event, context);
    case 'create':
      return await createCategory.main(event, context);
    case 'update':
      return await updateCategory.main(event, context);
    case 'delete':
      return await deleteCategory.main(event, context);
    default:
      throw new Error("未定义method");
  }
}

const mapBill = async (event, context) => {
  // switch (event.method) {
  //   case 'list':
  //     return await getCategories.main(event, context);
  // }
}
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let data;
    switch (event.type) {
      case 'USER':
        data = await mapUser(event, context);
        break;
      case 'CATEGORY':
        data = await mapCategory(event, context);
        break;
      case 'BILL':
        data = await mapBill(event, context);
        break;
      default:
        throw new Error("未定义type");
    }

    return {
      data,
      success: true
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e.message
    };
  }
}

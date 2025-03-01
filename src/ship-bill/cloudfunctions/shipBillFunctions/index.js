// 云函数入口文件
const cloud = require('wx-server-sdk')
const wxctx = require('./wx-context');

const getCategories = require('./categories/list/index');
const createUser = require('./user/create/index');
const updateUser = require('./user/update/index');
const getOpenId = require('./user/openid/index');
const getUser = require('./user/get/index');

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
  }
}

const mapCategory = async (event, context) => {
  switch (event.method) {
    case 'list':
      return await getCategories.main(event, context);
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
  switch (event.type) {
    case 'USER':
      return await mapUser(event, context);
    case 'CATEGORY':
      return await mapCategory(event, context);
    case 'BILL':
      return await mapBill(event, context);
  }
}

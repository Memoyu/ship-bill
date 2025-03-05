// 云函数入口文件
const cloud = require('wx-server-sdk')

const createUser = require('./user/create/index');
const updateUser = require('./user/update/index');
const getOpenId = require('./user/openid/index');
const getUser = require('./user/get/index');

const getCategories = require('./category/list/index');
const createCategory = require('./category/create/index');
const updateCategory = require('./category/update/index');
const deleteCategory = require('./category/delete/index');

const updateConfig = require('./config/update/index');
const getConfig = require('./config/get/index');

const createBill = require('./bill/create/index');
const updateBill = require('./bill/update/index');
const deleteBill = require('./bill/delete/index');
const getBills = require('./bill/list/index');
const getBill = require('./bill/get/index');
const getHomeBillSummary = require('./bill/home/summary');
const getHomeBillReport = require('./bill/home/report');

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
      throw new Error("未定义User method:" + event.method);
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
      throw new Error("未定义Category method:" + event.method);
  }
}

const mapBill = async (event, context) => {
  switch (event.method) {
    case 'create':
      return await createBill.main(event, context);
    case 'update':
      return await updateBill.main(event, context);
    case 'delete':
      return await deleteBill.main(event, context);
    case 'list':
      return await getBills.main(event, context);
    case 'get':
      return await getBill.main(event, context);
    case 'home_summary':
      return await getHomeBillSummary.main(event, context);
    case 'home_report':
      return await getHomeBillReport.main(event, context);
    default:
      throw new Error("未定义Bill method:" + event.method);
  }
}

const mapConfig = async (event, context) => {
  switch (event.method) {
    case 'update':
      return await updateConfig.main(event, context);
    case 'get':
      return await getConfig.main(event, context);
    default:
      throw new Error("未定义Config method:" + event.method);
  }
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
      case 'CONFIG':
        data = await mapConfig(event, context);
        break;
      default:
        throw new Error("未定义type:" + event.type);
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

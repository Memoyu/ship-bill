// 云函数入口文件
const cloud = require('wx-server-sdk')

const getCategories = require('./categories/getCategories/index');
const selectRecord = require('./user/createUser/index');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getCategories':
      return await  getCategories.main(event, context);
  }
}
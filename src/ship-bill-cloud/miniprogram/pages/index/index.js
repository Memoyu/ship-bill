"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "Hello"
    };
  },
  onLoad() {

    // wx.cloud.callFunction({
    //   name: 'shipBillFunctions',
    //   data: {
    //     type: 'CATEGORY',
    //     method: 'list'
    //   }
    // }).then((resp) => {
    //   console.log(resp)
    // }).catch((e) => {
    //   console.log(e);
    // });

    // wx.cloud.callFunction({
    //   name: 'shipBillFunctions',
    //   data: {
    //     type: 'USER',
    //     method: 'openid'
    //   }
    // }).then((resp) => {
    //   console.log(resp)
    // }).catch((e) => {
    //   console.log(e);
    // });

    // wx.cloud.callFunction({
    //   name: 'shipBillFunctions',
    //   data: {
    //     type: 'USER',
    //     method: 'create',
    //     data: {
    //       company: "犬天公司",
    //       licence_plate: "粤A5TG67",
    //       name: "开发2",
    //       phone: "13766668877",
    //       create_date: "2025-02-23T06:36:27.233Z",
    //       modify_date: "2025-02-23T06:37:06.188Z"
    //     }
    //   }
    // }).then((resp) => {
    //   console.log(resp)
    // }).catch((e) => {
    //   console.log(e);
    // });

    wx.cloud.callFunction({
      name: 'shipBillFunctions',
      data: {
        type: 'USER',
        method: 'update',
        data: {
          company: "22犬天公司",
          licence_plate: "粤A5TG67",
          name: "开发3332",
          openid: 'oKyAH5n00PeivG8zsbgVWq6lwnS2',
          phone: "13766660000",
          create_date: "2025-02-23T06:36:27.233Z",
          modify_date: "2025-02-23T06:37:06.188Z"
        }
      }
    }).then((resp) => {
      console.log(resp)
    }).catch((e) => {
      console.log(e);
    });
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.t($data.title)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);

import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'ship bill',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/bill.png',
        selectedIconPath: 'static/tabbar/bill.png',
        pagePath: 'pages/bill/index',
        text: '流水',
      },
      {
        iconPath: 'static/tabbar/bill.png',
        selectedIconPath: 'static/tabbar/bill.png',
        pagePath: 'pages/report/index',
        text: '报表',
      },
      {
        iconPath: 'static/tabbar/plus.png',
        selectedIconPath: 'static/tabbar/plus.png',
        pagePath: 'pages/bill/edit',
      },
      {
        iconPath: 'static/tabbar/bill.png',
        selectedIconPath: 'static/tabbar/bill.png',
        pagePath: 'pages/chart/index',
        text: '图表',
      },
      {
        iconPath: 'static/tabbar/bill.png',
        selectedIconPath: 'static/tabbar/bill.png',
        pagePath: 'pages/user/index',
        text: '我的',
      },
    ],
  },
})

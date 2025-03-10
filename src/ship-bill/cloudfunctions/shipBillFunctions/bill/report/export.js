const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');
const xlsx = require('node-xlsx') //导入Excel类库

const getReportBillQuery = require('./query');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let openid = wxctx.getOpenId();
  // 获取数据数据
  let res = await getReportBillQuery.main(event, context);
  let items = res ?? [];

  let fileName = `exports/${openid}-${Math.floor(Math.random()*1000000000)}.xlsx`;
  //声明一个Excel表，表的名字用随机数产生
  let allRows = [];
  let row = [
    '日期', '磅费', '封柜费', '异提费', '加班', '超时费', '补贴', '压夜', '超重费', '提空', '提重', '还空', '还重',
    '渡柜', '停车费', '高速费', '尿素', '提柜费', '洗柜费', '换柜费', '验还柜', '修箱费', '补胎', '吊柜费', '打单费', '封条费', '薰柜费', '修车费',
    '其它', '加油(升)', '加油金额(元)', '产值', '提成'
  ]; //表格的属性，也就是表头说明对象

  allRows.push(row); //将此行数据添加到一个向表格中存数据的数组中
  //接下来是通过循环将数据存到向表格中存数据的数组中
  let bangTotal = 0;
  let fengGuiTotal = 0;
  let yiTiTotal = 0;
  let jiaBanTotal = 0;
  let chaoShiTotal = 0;
  let buTieTotal = 0;
  let yaYeTotal = 0;
  let chaoZhongTotal = 0;
  let tiKongTotal = 0;
  let tiZhongTotal = 0;
  let haunKongTotal = 0;
  let haunZhongTotal = 0;
  let duGuiTotal = 0;
  let tingCheTotal = 0;
  let gaoSuTotal = 0;
  let naioSuTotal = 0;
  let tiGuiTotal = 0;
  let xiGuiTotal = 0;
  let huanGuiTotal = 0;
  let yanHuanGuiTotal = 0;
  let xiuXiangTotal = 0;
  let buTaiTotal = 0;
  let diaoGuiTotal = 0;
  let daDanTotal = 0;
  let fengTiaoTotal = 0;
  let xunGuiTotal = 0;
  let xiuCheTotal = 0;
  let otherTotal = 0;
  let oilTotalTotal = 0;
  let oilAmountTotal = 0;
  let outputValueTotal = 0;
  let commissionTotal = 0;

  items.map(b => {
    let dataCols = [];

    dataCols.push(b.date);
    dataCols.push(b.bang);
    dataCols.push(b.fengGui);
    dataCols.push(b.yiTi);
    dataCols.push(b.jiaBan);
    dataCols.push(b.chaoShi);
    dataCols.push(b.buTie);
    dataCols.push(b.yaYe);
    dataCols.push(b.chaoZhong);
    dataCols.push(b.tiKong);
    dataCols.push(b.tiZhong);
    dataCols.push(b.haunKong);
    dataCols.push(b.haunZhong);
    dataCols.push(b.duGui);
    dataCols.push(b.tingChe);
    dataCols.push(b.gaoSu);
    dataCols.push(b.naioSu);
    dataCols.push(b.tiGui);
    dataCols.push(b.xiGui);
    dataCols.push(b.huanGui);
    dataCols.push(b.yanHuanGui);
    dataCols.push(b.xiuXiang);
    dataCols.push(b.buTai);
    dataCols.push(b.diaoGui);
    dataCols.push(b.daDan);
    dataCols.push(b.fengTiao);
    dataCols.push(b.xunGui);
    dataCols.push(b.xiuChe);
    dataCols.push(b.other);
    dataCols.push(b.oilTotal);
    dataCols.push(b.oilAmount);
    dataCols.push(b.outputValue);
    dataCols.push(b.commission);

    // 汇总
    bangTotal += b.bang;
    fengGuiTotal += b.fengGui;
    yiTiTotal += b.yiTi;
    jiaBanTotal += b.jiaBan;
    chaoShiTotal += b.chaoShi;
    buTieTotal += b.buTie;
    yaYeTotal += b.yaYe;
    chaoZhongTotal += b.chaoZhong;
    tiKongTotal += b.tiKong;
    tiZhongTotal += b.tiZhong;
    haunKongTotal += b.haunKong;
    haunZhongTotal += b.haunZhong;
    duGuiTotal += b.duGui;
    tingCheTotal += b.tingChe;
    gaoSuTotal += b.gaoSu;
    naioSuTotal += b.naioSu;
    tiGuiTotal += b.tiGui;
    xiGuiTotal += b.xiGui;
    huanGuiTotal += b.huanGui;
    yanHuanGuiTotal += b.yanHuanGui;
    xiuXiangTotal += b.xiuXiang;
    buTaiTotal += b.buTai;
    diaoGuiTotal += b.diaoGui;
    daDanTotal += b.daDan;
    fengTiaoTotal += b.fengTiao;
    xunGuiTotal += b.xunGui;
    xiuCheTotal += b.xiuChe;
    otherTotal += b.other;
    oilTotalTotal += b.oilTotal;
    oilAmountTotal += b.oilAmount;
    outputValueTotal += b.outputValue;
    commissionTotal += b.commission;

    allRows.push(dataCols);
  });

  allRows.push([
    '汇总：',
    parseFloat((bangTotal).toFixed(2)),
    parseFloat((fengGuiTotal).toFixed(2)),
    parseFloat((yiTiTotal).toFixed(2)),
    parseFloat((jiaBanTotal).toFixed(2)),
    parseFloat((chaoShiTotal).toFixed(2)),
    parseFloat((buTieTotal).toFixed(2)),
    parseFloat((yaYeTotal).toFixed(2)),
    parseFloat((chaoZhongTotal).toFixed(2)),
    parseFloat((tiKongTotal).toFixed(2)),
    parseFloat((tiZhongTotal).toFixed(2)),
    parseFloat((haunKongTotal).toFixed(2)),
    parseFloat((haunZhongTotal).toFixed(2)),
    parseFloat((duGuiTotal).toFixed(2)),
    parseFloat((tingCheTotal).toFixed(2)),
    parseFloat((gaoSuTotal).toFixed(2)),
    parseFloat((naioSuTotal).toFixed(2)),
    parseFloat((tiGuiTotal).toFixed(2)),
    parseFloat((xiGuiTotal).toFixed(2)),
    parseFloat((huanGuiTotal).toFixed(2)),
    parseFloat((yanHuanGuiTotal).toFixed(2)),
    parseFloat((xiuXiangTotal).toFixed(2)),
    parseFloat((buTaiTotal).toFixed(2)),
    parseFloat((diaoGuiTotal).toFixed(2)),
    parseFloat((daDanTotal).toFixed(2)),
    parseFloat((fengTiaoTotal).toFixed(2)),
    parseFloat((xunGuiTotal).toFixed(2)),
    parseFloat((xiuCheTotal).toFixed(2)),
    parseFloat((otherTotal).toFixed(2)),
    parseFloat((oilTotalTotal).toFixed(2)),
    parseFloat((oilAmountTotal).toFixed(2)),
    parseFloat((outputValueTotal).toFixed(2)),
    parseFloat((commissionTotal).toFixed(2)),
  ])

  var buffer = xlsx.build([{
    name: "bill-reports",
    data: allRows
  }]);

  //将表格存入到存储库中并返回文件ID
  return await cloud.uploadFile({
    cloudPath: fileName,
    fileContent: buffer, //excel二进制文件
  })
};

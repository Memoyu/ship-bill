const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');
const xlsx = require('node-xlsx') //导入Excel类库

const getReportBillQuery = require('./query');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  let openid = wxctx.getOpenId();
  // 获取数据数据
  let res = await getReportBillQuery.main(event, context);
  let items = res.reports ?? [];
  let summary = res.summary ?? {};
  if (items.length < 1) throw new Error("导出数据为空，导出失败");

  const data = event.data;
  const begin = items[0].date;
  const end = items[items.length - 1].date;

  let fileName = `exports/${openid}-${begin}~${end}-${Math.floor(Math.random()*1000000000)}.xlsx`;
  //声明一个Excel表，表的名字用随机数产生
  let allRows = [];

  const filterHeaders = data.headers.filter(h => {
    return h.ignoreSummary || summary[h.prop] > 0
  });

  let row = filterHeaders.map(h => h.title); //表格的属性，也就是表头说明对象
  allRows.push(row); //将此行数据添加到一个向表格中存数据的数组中

  items.map(b => {
    let dataCols = [];

    filterHeaders.forEach(h => {
      const value = b[h.prop] === undefined ? '' : b[h.prop];
      dataCols.push(value);
    })

    allRows.push(dataCols);
  });

  let summaryRow = []
  filterHeaders.forEach(h => {
    if (summary[h.prop]) {
      summaryRow.push(parseFloat((summary[h.prop]).toFixed(2)));
    } else {
      summaryRow.push('')
    }
  });
  summaryRow[0] = '汇总：'
  allRows.push(summaryRow);

  const options = {
    "!cols": [{
      wch: 11
    }, {
      wch: 50
    }, {
      wch: 25
    }, {
      wch: 25
    }], //列宽
  };

  var buffer = xlsx.build([{
    name: `${begin}~${end}`,
    data: allRows,
    options
  }]);

  //将表格存入到存储库中并返回文件ID
  return await cloud.uploadFile({
    cloudPath: fileName,
    fileContent: buffer, //excel二进制文件
  })
};

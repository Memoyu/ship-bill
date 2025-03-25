const cloud = require('wx-server-sdk');
const wxctx = require('../../wx-context');
const ExcelJS = require('exceljs');

const getReportBillQuery = require('./query');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// exports.main = async (event, context) => {
//   let openid = wxctx.getOpenId();
//   // 获取数据数据
//   let res = await getReportBillQuery.main(event, context);
//   let items = res.reports ?? [];
//   let summary = res.summary ?? {};
//   if (items.length < 1) throw new Error("导出数据为空，导出失败");

//   const data = event.data;
//   const begin = items[0].date;
//   const end = items[items.length - 1].date;

//   let fileName = `exports/${openid}-${begin}~${end}-${Math.floor(Math.random()*1000000000)}.xlsx`;
//   //声明一个Excel表，表的名字用随机数产生
//   let allRows = [];

//   const filterHeaders = data.headers.filter(h => {
//     return h.ignoreSummary || summary[h.prop] > 0
//   });

//   let row = filterHeaders.map(h => h.title); //表格的属性，也就是表头说明对象
//   allRows.push(row); //将此行数据添加到一个向表格中存数据的数组中

//   items.map(b => {
//     let dataCols = [];

//     filterHeaders.forEach(h => {
//       const value = b[h.prop] === undefined ? '' : b[h.prop];
//       const content = {
//         v: value,
//         s: {
//           alignment: {
//             wrapText: true
//           }
//         }
//       };
//       dataCols.push(content);
//     })

//     allRows.push(dataCols);
//   });

//   let summaryRow = []
//   filterHeaders.forEach(h => {
//     if (summary[h.prop]) {
//       summaryRow.push(parseFloat((summary[h.prop]).toFixed(2)));
//     } else {
//       summaryRow.push('')
//     }
//   });
//   summaryRow[0] = '汇总：'
//   allRows.push(summaryRow);

//   const rowHeight = 50;
//   const options = {
//     "!cols": [{
//       wch: 11
//     }, {
//       wch: 50
//     }, {
//       wch: 25
//     }, {
//       wch: 25
//     }], //列宽
//     // '!rows': allRows.map((r, index) => {
//     //   let h = rowHeight;
//     //   if (index == 0 || index == allRows.length - 1)
//     //     h = 20;
//     //   else
//     //     h = rowHeight;

//     //   return {
//     //     hpx: h
//     //   }
//     // }) // 设置第一行的高度为50像素

//   };

//   var buffer = xlsx.build([{
//     name: `${begin}~${end}`,
//     data: allRows,
//     options
//   }]);

//   //将表格存入到存储库中并返回文件ID
//   return await cloud.uploadFile({
//     cloudPath: fileName,
//     fileContent: buffer, //excel二进制文件
//   })
// };

exports.main = async (event, context) => {
  let openid = wxctx.getOpenId();
  // 获取数据数据
  let res = await getReportBillQuery.main(event, context);
  let reports = res.reports ?? [];
  let summary = res.summary ?? {};
  if (reports.length < 1) throw new Error("导出数据为空，导出失败");

  const data = event.data;
  const begin = reports[0].date;
  const end = reports[reports.length - 1].date;

  let fileName = `exports/${openid}-${begin}~${end}-${Math.floor(Math.random()*1000000000)}.xlsx`;

  const workbook = new ExcelJS.Workbook(); // 创建新的工作簿
  const worksheet = workbook.addWorksheet(`${begin}~${end}`); // 创建新的工作表


  // 设置表头
  const filterColumns = data.headers.filter(h => {
    return h.ignoreSummary || summary[h.prop] > 0
  });
  const columnsWidth = {
    date: 11,
    address: 40,
    counter: 25,
    subCounter: 25,
    remark: 80,
  }
  worksheet.columns = filterColumns.map((fc, index) => {
    const w = columnsWidth[fc.prop] ? columnsWidth[fc.prop] : 10;
    return {
      header: fc.title,
      key: fc.prop,
      width: w
    }
  });

  worksheet.columns.forEach((item, i) => {
    item.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    }
  });

  reports.push({
    date: '汇总：',
    ...summary
  });

  reports.forEach(r => {
    worksheet.addRow(r);
  });

  worksheet.getRow(1).eachCell({
    includeEmpty: true
  }, (cell, colNumber) => {
    cell.font = {
      bold: true
    };
  });

  worksheet.lastRow.eachCell({
    includeEmpty: true
  }, (cell, colNumber) => {
    cell.font = {
      bold: true
    };
  });

  const buffer = await workbook.xlsx.writeBuffer();

  //将表格存入到存储库中并返回文件ID
  return await cloud.uploadFile({
    cloudPath: fileName,
    fileContent: buffer, //excel二进制文件
  })
};

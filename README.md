<div align="center"  style="height: 200;">
    <img  style="zoom:55%;" src="https://raw.githubusercontent.com/Memoyu/ship-bill/refs/heads/main/doc/ship-bill-page.png" />
</div>
&emsp;基于uni-app + 微信云开发实现的运输行业账单记录小程序




## 功能实现

- 微信用户登录
- 用户信息管理
- 用户配置
- 账单分类管理
- 账单数据汇总
- 账单管理
- 账单报表、报表导出



## 项目结构

cloudfunctions：云函数接口，对数据库操作增删改查
src：uniapp页面及逻辑
dist：编译输出文件



## 运行

- 前置依赖
    > Node.js - >=v18
    > pnpm - >=7.30
    >
    > 小程序开通云开发功能
    
    
    
- 编译小程序

1. 替换你的appid（全局搜索：your-appid，进行替换）
2. 替换你的云开发环境id（App.vue下修改：your-cloud-env-id）
3. 编译小程序：

   > pnpm run dev:mp-weixin

4. 微信小程序开发者工具下导入项目，选云开发，导入目录：`src\ship-bill`

   

- 初始化云开发

1. 微信小程序开发者工具下使用云开控制台，创建云开发数据库集合：bills、categories、config、users，均为仅创建者可读写

2. 【可选】初始化分类数据：categories导入数据（初始化数据：doc\init\init.category.json）

3. 右键`cloudfunctions\shipBillFunctions`，上传并部署

4. 在云开控制台，云函数下，对`shipBillFunctions`云函数进行配置，高级配置下增加环境变量：

   > 配置时区
   > key: TZ      value: Asia/Shanghai



## 开源协议

MIT License. See [License here](./LICENSE) for details.

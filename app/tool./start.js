"use strict";

/**
 * 启动初始化参数 
 */
var start = module.exports;

var fs = require('fs');
// var mysqlPro = require( '../mysql/mysql.js' );
var mysqlPro = require( '../mysql/proMysql.js' );
var mysqlConfig = require( '../../config/mysql.json' );
//连接MySQL(mysql连接必须处于最优先)
global.mysqlConfig = mysqlConfig;
// global.db = new mysql( 100, 'database', mysqlConfig );
global.dbPro = new mysqlPro( 1, 'database', mysqlConfig );

// var myesSql = require( '../mysql/essql.js' );
// var esDb = new myesSql();
// console.log( "esDb", esDb );

const roleDao = require( '../dao/roleDao.js');

//启动运行
start.run = function( app )
{
    // 缓存数据库的基本信息
    roleDao.startCache();
    //加载路由
    start.router( app );
};

//加载路由
start.router = function( app )
{
    app.use( '/',  require( '../routes/index.js' ) );
    // 账号角色
    app.use( '/sapi/IAccountRoles', require( '../routes/iAccountRole.js' ) );
    app.use( '/sapi/IAccounts', require( '../routes/iAccounts.js' ) );
    app.use( '/gm', require( '../routes/gm.js' ) );
    // app.use('/users', require('../routes/users') );
    // app.use( '/gm', require( '../routes/gm.js' ) );
    // 没有找到页面
    app.use( '/', function( req, res )
    {
        res.send( '页面不存在');
    });
};

//启动定时程序(加载微信公众token)
start.wxTimer = function()
{
   //启动每日定时器
   // scheduleCronCycle();
};

//定时器的启动
function scheduleCronCycle()
{
    schedule.scheduleJob( '0 0 0 * * *', function()
    {
        // child_process.exec( 'sh /home/data/mysqlBack.sh', function( result )
        // {
        //     console.log(result );
        // });
    }); 
}
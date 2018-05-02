"use strict";

/**
 * 启动初始化参数 
 */
var start = module.exports;
var mysqlPro = require( '../mysql/proMysql.js' );
var mysqlConfig = require( '../../config/mysql.json' );
var schedule = require( "node-schedule" );  
//连接MySQL(mysql连接必须处于最优先)
global.mysqlConfig = mysqlConfig;
// global.db = new mysql( 100, 'database', mysqlConfig );
global.dbPro = new mysqlPro( 1, 'database', mysqlConfig );


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
    app.use( '/gm',  require( '../routes/gm.js' ) );
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
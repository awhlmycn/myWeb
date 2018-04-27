var lele = require( '../tool/lele.js' );
var runDao = require( './proDao.js' );
// var async = require( 'async' );
//var logger = require( __dirname +'/../tool/log4.js').getLogger( 'log_dao' );
var roleDao = module.exports;

//开始缓存所有的
roleDao.startCache = function()
{
    this.cacheAccountRole();
    this.cacheBrand();
}

/**
 * 1.获取缓存
 *     table
 *     type : 1 为数组
 *     key : 当变成json对象的时候有key值
 */
roleDao.getCache = function( table, type, key )
{
    // 返回数据库
    if( type == 1 )
    {
        return lele.empty( global[ table ] ) ? [] : global[ table ];
    }
    return lele.empty( global[ table ] ) ? {} : lele.arrToObj( global[ table ], key );
};

/**
 * 1.缓存品牌角色
 */
roleDao.cacheAccountRole = async function()
{
    let result = await runDao.query( 'select * from account_role ');
    global.account_role = result;
};

/**
 * 2.缓存品牌
 */
roleDao.cacheBrand = async function()
{
    var result = await runDao.query( 'select * from brand ');
    global.brand = result;
};

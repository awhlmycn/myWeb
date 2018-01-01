var lele = require( '../tools/lele.js' );
var runDao = require( './runDao.js' );
var async = require( 'async' );
var logger = require( __dirname +'/../tools/log4.js').getLogger( 'log_dao', 'gm' );
var gmDao = module.exports;

/**
 * 1.缓存任务信息
 * ch_task ： [] 数组
 */
gmDao.login = function( data, callback )
{
    var sql = 'account="' + data.account + '" AND password="' + data.password + '"';
    runDao.select( 'gm_account', sql, function( err, res )
    {
        if( err )
        {
            logger.error( '[ function-login-1:]' + err );
            callback( { 'error' : '服务器异常' } );
            return;
        }
        if( res.length <= 0 )
        {
            callback( { 'error' : '帐号或者密码错误' } );
            return;
        }
        var purview = formatPurview( res[0].purview );
        callback( purview );
    });
};

/*
    2.得到界面的purview数据
    retunr { id : {}}
*/
gmDao.cachePurview = function( ) 
{
    runDao.query( 'select * from gm_purview', function( err, result )
    {
        if( err )
        {
            logger.error( '[ function-cachePurview-1:]' + err );
            global.purview = {};
            return;
        }
        global.purview = lele.arrToObj( result, 'id' );
    });
};

gmDao.getCache = function( key )
{
    switch( key )
    {
        case 'purview':
            return global.purview;
        break;
        default:
            return {};
        break;
    };
};


//修改gm的参数
var formatPurview = function ( str )
{
    var obj = {};
    if ( !str ) return obj;
    var arr = str.split(';');
    for ( var i in arr )
    {
        var t_arr = arr[ i ].split(':');
        obj[ t_arr[ 0 ] ] = t_arr[ 1 ].split(',');
    }
    return obj;
};
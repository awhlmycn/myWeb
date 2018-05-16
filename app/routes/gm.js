const express = require( 'express' );
const router = express.Router();
module.exports = router;

const fs = require( 'fs' );
const formidable = require( 'formidable' );
var iconv = require('iconv-lite');
var xlsx = require('node-xlsx');



/*
    对csv文件进行换行
*/
var ConvertToTable = function( data ) 
{
    // data = data.toString();
    var table = [];
    var rows = [];
    rows = data.split("\n");
    for (var i = 0; i < rows.length; i++) {
        table.push( rows[i].split(",") );
    }
    return table;
}



router.all( '/upExcel', function( req, res ) {
    res.render( 'upExcel.html' );
});

/**
 *上传excel文件
 */
router.all( '/acceptExcel', function( req, res ) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    //设置文件临时放的位置
    form.uploadDir = './app/public/tmpFile/';
    //设置文件的接收大小
    form.maxFieldsSize = 3000 * 1024 * 1024;
    //保持文件的原名
    form.keepExtensions = true;

    // var button = [];
    //上传进度
    // form.on('progress', function( bytesReceived, bytesExpected ) {
    //     if( bytesExpected > 1 * 1024 * 1024 ) {
    //         this.emit( 'error', '文件过大' );
    //         return;
    //     }
    //     button.push( bytesReceived );
    //     console.log( "bytesReceived", bytesReceived );
    //     console.log( "bytesExpected" , bytesExpected );
    // });

    form.parse( req, function( err, files, file ) {
        if( err ) {
            console.log( "err" + err );
           
        }
        var fileInfo = null;
        for( key in file ) {
            fileInfo = file[key];
            break;
        }
        if( fileInfo.size > 1000 ) {
            console.log(1111111111);
        }
        res.json({ code : 200 });
        console.log( fileInfo);
        // res.json( { code : 200 });
    });
    // form.on('end', function() {
    //     console.log( button ); 
    //     console.log('end');   
    //     res.json({ code : 200 } );  
    // }); 
});















/*
    12. 上传csv文档
    只展示匹配到的玩家
*/
router.all( '/upfile', function( req, res )
{
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = './app/public/tmpFile/';    //设置上传目录
    form.keepExtensions = true;  //保留后缀
    form.maxFieldsSize = 20 * 1024 * 1024;   //文件大小
    form.parse( req, function( err, formData, files ) 
    {
        if( err ) 
        {
            logger.error( '[function-showred-1：]' + err );
            res.jsonp( { error : err } );
            return;     
        }
        var platform = formData.platform;
        var filepath = files.file.path;
        var orderJson = {};
        var up_billons = {};
        async.waterfall([
            function( cb )
            {
                fs.readFile( filepath, { encoding :'binary' }, cb );
            },
            function( fileStr, cb )
            {   
                var buf = new Buffer( fileStr, 'binary');
                var str = iconv.decode( buf, 'GBK');
                var arrs = ConvertToTable( str );
                var titles = arrs[0]; //获取文件的title 是个数组
                var cloneArr = lele.clone( arrs );
                cloneArr.splice( 0, 1 ); //把标题给清除掉
                var orderIndex = titles.indexOf( '订单编号' ) == -1 ? 0 : titles.indexOf( '订单编号' );
                var nameIndex = titles.indexOf( '买家会员名' ) == -1 ? 1 : titles.indexOf( '买家会员名' );
                var tbAcctIndex = titles.indexOf( '买家支付宝帐号' ) == -1 ? 2 : titles.indexOf( '买家支付宝帐号' );
                var priceIndex = titles.indexOf( '买家应付货款' ) == -1 ? 3 : titles.indexOf( '买家应付货款' );
                var sigArr = null;
                var billno = null;
                var role_name = null;
                var tb_account = null;
                var price = null;
                var isEquip = false;
                for( var i = 0; i < cloneArr.length; i++ )
                {
                    sigArr = cloneArr[ i ];
                    if( lele.empty( sigArr[0] ) ) break;
                    billno = sigArr[ orderIndex ];
                    if( sigArr[ orderIndex ].indexOf( '=' ) != -1 )
                    {
                        billno = sigArr[ orderIndex ].split( '=' )[1];
                        isEquip = true;
                    }
                    billno = billno.replace("\"","").replace("\"","").toString();
                    role_name = sigArr[ nameIndex ].replace("\"","").replace("\"","");
                    tb_account = sigArr[ tbAcctIndex ].replace("\"","").replace("\"","");
                    price = sigArr[ priceIndex ].replace("\"","").replace("\"","");
                    orderJson[ billno ] = { 'billno' : billno, 'tb_account' : tb_account, 'role_name' : role_name, 'price' : price, 'time' : lele.getTime(), 'platform' : platform };
                }
                var matchOrder = Object.keys( orderJson );
                roleDao.getRedCsv( matchOrder, isEquip, platform, cb ); //查询是否已经在数据库中
            },
            function( result, cb )
            {
                for( var i = 0; i < result.length; i++ )
                {
                    delete orderJson[ result[i].billno ]; //删除已经存在数据库的
                }
                var tables = [];
                for( var key in orderJson )
                {
                    tables.push( orderJson[ key ] );
                }
                runDao.inserts( 'red_csv', tables, cb );
            },
            function( result, cb )
            {
                var wxDataBase = global.mysqlConfig.weixin;
                var sql = 'select id,openid,img_url,billno,send_redpak,platform,time from '+ wxDataBase + '.act_red_pak where send_redpak=0';
                if( !lele.empty( platform ) ) sql += ' and platform="' + platform + '"';
                runDao.query( sql, cb ); //查询所有上传的红包
            },
            function( result, cb )
            {
                if( result.length == 0 )
                {
                    res.jsonp( [] );   //是传送匹配到的玩家一个数组
                    return;
                }
                for( var i = 0; i < result.length; i++ )
                {
                    result[ i ][ 'role_name' ] = '';
                    result[ i ][ 'price' ] = '';
                    up_billons[ result[ i ].billno ] = result[ i ];
                }
                var tmp_billons = Object.keys( up_billons );
                var sql = 'select billno,role_name,price from red_csv where billno in (' + lele.chinaToStr( tmp_billons ) + ')';
                if( !lele.empty( platform ) ) sql += ' and platform="' + platform + '"'; //查询所有红包在记录中是否找的到
                runDao.query( sql, cb );
            },
            function( result, cb )
            {
                var csvJSon = lele.arrToObj( result, 'billno' );
                var match_info = [];
                for( var sigBillon in up_billons )
                {
                    if( csvJSon.hasOwnProperty( sigBillon ) )
                    {
                        up_billons[ sigBillon ][ 'role_name' ] = csvJSon[ sigBillon ].role_name;
                        up_billons[ sigBillon ][ 'price' ] = csvJSon[ sigBillon ].price;
                        match_info.push( up_billons[ sigBillon ] );
                    }
                }
                roleDao.insertUpCsv( files.file.name, platform );
                fs.unlinkSync( filepath );  //删除上传的文件
                match_info = match_info.sort( lele.sort ).reverse();
                res.jsonp( match_info );   //是传送匹配到的玩家一个数组
            }
        ], function( err )
        {
            if( err )
            {
                logger.error( '[function-showred-2：]' + err );
                res.jsonp( { 'err_code' : '比较红包失败' + err } );
                return;   
            }
        });
    });
});
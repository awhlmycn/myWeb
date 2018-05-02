/**
 * 1.underscord  : js的函数库
 * 2.
 */

const lele = require( '../tool/lele.js')
const validate = require( 'validate.js' );
var webot = require('webot');
const moment = require('moment');
const valJson = { presence: true };
module.exports = router;
const request = require( 'request');
const uuid = require('node-uuid');


const formidable = require( 'formidable' );
const fs = require( 'fs' );

/**
 * [uuid description]
 * @type {[type]}
 * 生成唯一的标识
 * uuid.v1() -->基于时间戳生成 
 * uuid.v4();-->随机生成  ->这个有可能会有重复
 */


var component_appid = 'wxa31a6a54e5b6a0b6';
var component_appsecret = '9e53beb21bcd68e3ecebffa1f5602ec7';

var getComponentAccessToken = function()
{
    var param = {
        component_appid : component_appid//第三方平台appid
    }
    const component_access_token = '';
    var options = {
        method : 'POST',
        url : 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=' + component_access_token,
        body : JSON.stringify( param )
    };
    request( options, function( err, response, body )
    {
        body = JSON.parse( body );
        console.log( " body ", body );
    });
}



/*
    1。菜品图片上传
 */
router.post( '/upFoodInfo', function( req, res )
{
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';//设置表单域的编码
    orm.uploadDir = './app/public/tmpFile/';    //设置上传目录
    form.maxFieldsSize = 2 * 1024 * 1024; //限制上传图片的大小
    form.keepExtensions = true; //是否保存原来的文件名

    form.parse( req, function( err, fields, files )
    {
        var filepath = files.file.path;
        if( err )
        {
            fs.unlinkSync( filepath );
            res.json( { 'error' : '数据错误'});
            return;
        }
        var newPath = './app/public/upload/' + files.name;
        var extName = '';
        switch ( files.file.type ) 
        {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;        
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;        
        }
        newPath += extName;
        fs.renameSync( files.file.path, newPath );  //删除旧的文件地址，并且创建新的
    });
    form.on( 'end', function()
    {
        res.json({ code : 200 }); 
        return;
    });
});

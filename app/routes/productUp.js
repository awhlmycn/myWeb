const express = require( 'express' );
let router = express.Router();
const runDao = require('../dao/proDao.js');
const lele = require( '../tool/lele.js');
module.exports = router;

const formidable = require( 'formidable' );
const fs = require( 'fs' );

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

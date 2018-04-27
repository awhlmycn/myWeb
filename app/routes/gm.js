const express = require( 'express' );
const router = express.Router();
module.exports = router;

const fs = require( 'fs' );
const formidable = require( 'formidable' );

//1.大文件的上传
router.all( '/upfile', ( req, res ) => {
	var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';//设置表单域的编码
    orm.uploadDir = './app/public/tmpFile/';    //设置上传目录
    form.maxFieldsSize = 2 * 1024 * 1024; //限制上传图片的大小
    form.keepExtensions = true; //是否保存原来的文件名

    form.parse( req, function( err, fields, files ) {
    	var filepath = files.file.path;
        if( err )
        {
            fs.unlinkSync( filepath );
            res.json( { 'error' : '数据错误'});
            return;
        }
        var newPath = './app/public/upload/' + files.name;
        res.json({ code : 200 });
    });
});
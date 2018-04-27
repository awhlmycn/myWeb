const express = require( 'express' );
const router = express.Router();
module.exports = router;

const fs = require( 'fs' );
const formidable = require( 'formidable' );

//1.大文件的上传
router.all( '/upload', ( req, res ) => {
    var successed = 0;
var output=[];
	var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';//设置表单域的编码
    form.maxFieldsSize = 2 * 1024 * 1024; //限制上传图片的大小
form.uploadDir = './app/public/tmpFile/';    //设置上传目录
form.keepExtensions = true;
form.parse(req, function(err, fields, files) {
if(output.length==0){
output= new Array(fields.total);
}
output[fields.index]=files.data;
++successed;
if(successed == fields.total){
function read(i){
var data = fs.readFileSync(output[i].path);
fs.appendFile('./app/public/tmpFile/'+fields.name,data);
fs.unlink(output[i].path);
i++;
if(i<successed){
read(i);
}else{
successed=0;
output=[];
return;
}
}
}
res.end("1");
});
});
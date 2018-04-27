<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>login</title>
<link rel="stylesheet" href="css/index.css">
</head>
<body>
<form>
<input type="text" name="username" placeholder="用户名">
<input type="password" name="password" placeholder="密码">
<input type="file" name="file">
<input type="button" value="上传" >
<div></div>
</form>
<script src="js/index.js"></script>
</body>
</html>
index.js
/**
* Created by Administrator on 2017/04/09 0009.
*/
function sendForm(){
var process = document.getElementsByTagName('div')[0];
var file = formAll.children[2].files[0];
var size = file.size;
var name = file.name;
var shardSize = 2*1024*1024;
var total = Math.ceil(size/shardSize);
var successed = 0;
var un = document.getElementsByTagName('input')[0];
var pw = document.getElementsByTagName('input')[1];
for(var i=0;i<total;i++){
var start = i*shardSize;
var end = (i+1)*shardSize>size?size:(i+1)*shardSize;
var form = new FormData();
form.append('name',name);
form.append('total',total);
form.append('data',file.slice(start,end));
form.append('index',i);
form.append('un',un.value);
form.append('pw',pw.value);
var xhr = new XMLHttpRequest();
xhr.open('post','http://192.168.0.8:9999/upload');
xhr.send(form);
xhr.onload=function(){
++successed;
console.log(successed);
process.style.width = (successed/total)*100+"%";
}
}
}
var formAll = document.getElementsByTagName('form')[0];
var uploadBtn = formAll.children[3];
uploadBtn.onclick = sendForm;
httpServer.js
const express = require('express');
const xtpl = require('xtpl');
const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');
const router = new express.Router();
var schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/logindb');
var app = express();
var successed = 0;
var output=[];
app.use(express.static('./static'));
app.set('views','./view');
app.set('view engine','html');
app.engine('html',xtpl.renderFile);
var loginSchema = new mongoose.Schema({
username:String,
passward:String
});
var login = mongoose.model('login',loginSchema);
router.get('/index',function(req,res){
res.render('index.html',{});
});
router.post('/upload',function(req,res){
var form = new formidable.IncomingForm();
form.uploadDir = "./static/upload";
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
fs.appendFile('./static/upload/'+fields.name,data);
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
read(0);
login.create({username:fields.un+"",passward:fields.pw+""},function(err,result){
if(err){
console.log(err);
return;
}
console.log('ok');
});
}
res.end("1");
});
});
app.use(router);
app.listen(9999,'192.168.0.8');
package.json
{
"name": "mongodb",
"version": "1.0.0",
"description": "mongodb",
"main": "httpServer.js",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
"keywords": [
"mongoose"
],
"author": "chenyanrui",
"license": "ISC",
"dependencies": {
"express": "^4.15.2",
"formidable": "^1.1.1",
"mongoose": "^4.9.3",
"xtemplate": "^4.6.0",
"xtpl": "^3.3.0"
}
}
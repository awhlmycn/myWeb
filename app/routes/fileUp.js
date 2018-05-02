const ejsExcel = require( 'ejsexcel' );
const fs = require( 'fs' );
const request = require( 'request' );
//文件模块的例子 : https://www.jianshu.com/p/5683c8a93511

// request('http://e.hiphotos.baidu.com/image/pic/item/ae51f3deb48f8c54c8a5db4236292df5e0fe7f6c.jpg').pipe(
// 	fs.createWriteStream('doodle.png')
// );


// var data = fs.createReadStream( './ceshi.xlsx' );
// ejsExcel.getExcelArr( data).then(exlJson=>{
// 	console.log("exlJson", exlJson);
// });
//（2）使用fs将excel文件读取到buffer中
// let exBuf = fs.readFileSync( './ceshi.xlsx' );
// console.log( exBuf );
// var straem = fs.createReadStream( './ceshi.xlsx' );
// var bufs = [];
// straem.on('data', function( tmpChunk ) {
// 	bufs.push( tmpChunk );
// });


// straem.on( 'end', function() {
// 	// 接收数据结束后，拼接所有收到的Buffer对象
//   var buf = Buffer.concat(bufs);
//   ejsExcel.getExcelArr(buf).then(exlJson=>{
//     console.log("************  read success:getExcelArr");
//     let workBook = exlJson;
//     let workSheets = workBook[ 0 ];
    // workSheets.forEach((item,index)=>{
    //         console.log((index+1)+" row:"+item.join('    '));
    // })
// }).catch(error=>{
//     console.log("************** had error!");
//     console.log(error);
// });
// });
// (3）使用ejsExcel的getExcelArr将buffer读取为数组
// ejsExcel.getExcelArr(exBuf).then(exlJson=>{
//     console.log("************  read success:getExcelArr");
//     let workBook = exlJson;
//     let workSheets = workBook[ 0 ];
//     console.log( workSheets );
//     // workSheets.forEach((item,index)=>{
//     //         console.log((index+1)+" row:"+item.join('    '));
//     // })
// }).catch(error=>{
//     console.log("************** had error!");
//     console.log(error);
// });



/*******************************读取大文件
    nodejs进行视频读取时不能像读取图片之类的一次性读取
    而是必须读取一部分返回一部分，这样客户端的播放才会边缓冲边播放，而不必等待全部缓冲完再播放。
***********************************/
const fs = require( 'fs' );
var readBifFile = function( filename, response ) {
    var readStream = fs.ReadStream(filename);  
          
    var contentType = 'none';  
    var ext = path.extname(filename);  
    switch (ext) {  
        case ".flv":  
            contentType = "video/flv";  
            break;  
    }  

    response.writeHead(200, {  
        'Content-Type' : contentType,  
        'Accept-Ranges' : 'bytes',  
        'Server' : 'Microsoft-IIS/7.5',  
        'X-Powered-By' : 'ASP.NET'  
    });  
      
      

    readStream.on('close', function() {  
        response.end();  
        console.log("Stream finished.");  
    });  
    readStream.pipe(response);  
}
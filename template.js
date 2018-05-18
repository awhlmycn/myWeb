'use strict';

/**
 * @name: TemplateController
 * @type {[type]}
 */

const Controller = require('egg').Controller;
const lele = require( '../lib/lele.js' );
const fs = require( 'fs' );
const path = require( 'path' );
//这个只能去读xlsx 如果要读取csv ->node-csv
let xlsx = require( 'node-xlsx' );
// let nodeCsv = require('node-csv').createParser();
let iconv = require( 'iconv-lite' );

class TemplateController extends Controller {
//http://cnodejs.org/topic/5770eb6bd3baaf401780bbfe
	/**
	 * @author {lmy}
	 * [1.查看模板列表]
	 * @param  { page : 1 第几页  pageNum ： 每页显示多少 }
	 * @return {[type]} [description]
	 */
	async templateList() {
		try{
  		const { ctx, service } = this;
  		const DB = service.common.dao;
  		const data = lele.empty( ctx.request.body ) ? ctx.request.query : ctx.request.body;
  		if( !data.hasOwnProperty( 'page' ) || !data.hasOwnProperty( 'pageNum' ) ) {
  			throw{ code : 1, errMsg : '参数异常' };
  		}
  		var filterSql = {
  			raw : true,
				offset: lele.intval( ( data.page -1 ) * data.pageNum ),
				limit: lele.intval( data.pageNum )
  		};
  		var templates = await DB.findAll( 'Group', filterSql );
  		ctx.body = { code : 200, result : templates };
  	}
  	catch( e ) {
      console.log("templateList-->" + e );
  		var errCode = { code : 500, errMsg : e.toString() };
      if(e.code) errCode = Object.assign( errCode, e );
      this.ctx.body = errCode;
  	}
	}
	/**
	 * @author {lmy}
	 * [2.查询模板信息]
	 * @param  {string}
	 *         "name": 'kilmy',
						 "code" : '112fsfs',
						 "createdTime" : 1111,
						 "createdUid" : 'kilmy'
	 */
  async queryTemplates() {
  	try{
  		const { ctx, service } = this;
  		const DB = service.common.dao;
  		let data = lele.empty( ctx.request.body ) ? ctx.request.query : ctx.request.body;
      data = {
        name : '我是模板1'
        // code : '123',
        // createdTime : '123455'
        // createdUid : 'kilmy'
      };
      //把删除的过滤掉
      
  		var conditionArr = [];
      //1.名称, 2.模板编号 3.创建时间 4.创建者
      var conditions = [ 'name', 'code', 'createdTime', 'createdUid' ];
      conditions.forEach( val => {
        if( data.hasOwnProperty( val ) ) {
          conditionArr.push( { [ val ]: data[val]} );
        }
      });
      if( conditions.length == 0 ) {
        ctx.body = { code : 200, result : [] };
        return;
      }
      conditionArr.push( { isDeleted : 1 } );
      var filterSql = {
        raw : true,
        where : { $and : conditionArr },
        attributes : { exclude : [ 'createdTime', 'updatedTime' ] }
      };
      var templates = await DB.findAll( 'Group', filterSql );
      ctx.body = { code : 200, result : templates };
  	}
  	catch( e ) {
  		var errCode = { code : 500, errMsg : e.toString() };
      if(e.code) errCode = Object.assign( errCode, e );
      this.ctx.body = errCode;
  	}
  }
  /**
   * @author {lmy}
   * [3.复制一个模板]
   * @param  { templateId : 1 需要复制的模板 }
   */
  async duplicateQueryTemp() {

  }
  async importTemplates() {

  }

  async createQueryTemp() {

  }
  /**
   * @author {lmy}
   * [6下载模板]  table : 'DataImportTemplate'
   * @param ： dataType : 1 会员数据 2 交易数据 3产品数据 4 门店数据 5 区域数据
   */
  async downTemp() {
    try{
      const { ctx, service } = this;
      const DB = service.common.dao;
      var data = lele.empty( ctx.request.body ) ? ctx.request.query : ctx.request.body;
      var dataType = data.dataType;
      if( lele.intval( dataType ) == 0 ) {
        throw{ code : 1, errMsg : '数据异常' }
      }
      var filterSql = {
        raw : true,
        where : { dataType: dataType },
        attributes : [ 'templateId', 'name','dataType', 'downloadUrl', 'properties' ]
      };
      var dataTemps = await DB.findAll( 'DataImportTemplate', filterSql );
      ctx.body = { code : 200, result : dataTemps };
    }
    catch( e ) {
      console.log( 'downTemp-->' + e );
      var errCode = { code : 500, errMsg : e.toString() };
      if(e.code) errCode = Object.assign( errCode, e );
      this.ctx.body = errCode;
    }
  }
  /**
   * @author {lmy}
   * [7.文件模板的上传]
   * @param  {string}
   * @return {[type]} [description]
   */
  async upExcel() {
    try{
      const { ctx, service } = this;
      const DB = service.common.dao;
      let data = ctx.req.body;
      const files = ctx.req.files;
      if( lele.empty( files[0] ) ) {
        throw{ code : 1, errMsg : '数据异常' };
      }
      //后缀名 xiaoming.xlsx
      const originaName = files[0].originalname;
      const oldPath = files[0].path;
      let allowFileType = [ '.xlsx','.csv' ];
      //这里做文件类 型的判断
      if( allowFileType.indexOf( path.extname( originaName ) ) == -1 ) {
        fs.unlink( oldPath, function(){}); //这里不需要同步处理
        throw{ code : 1, errMsg : '数据异常' };
      }
      let localUrl = './app/public/upload/excel/';
      const newPath = localUrl + originaName;
      fs.rename( oldPath, newPath, async function( err ) {
        try{
          if( err ) {
            console.log("err", err );
            fs.unlink( oldPath, function(){}); //这里不需要同步处理
            throw { code : 500, errMsg : '服务器异常' };
          }
          //这个是读取csv文件的  注意 只能读取默认的第一页。。 其他读取的时候编码有问题
          if( originaName.includes( 'csv' ) ) {
            var fileStr = fs.readFileSync( newPath, { encoding : 'binary' });
            var buf = new Buffer( fileStr, 'binary' );
            var str = iconv.decode( buf , 'GBK' );
            var data = lele.ConvertToTable( str );
            ctx.body = { code : 200 };
          }
          else{
            //1.读取excel的数据
            let workSheetsFromFile = xlsx.parse( newPath );
            if( workSheetsFromFile.length == 0 ) {
              throw{ code : 500, errMsg : '读取数据异常' };
            }
            workSheetsFromFile = workSheetsFromFile[0];
            //这里只做对一次个文件的读取
            //[ { name: 'Sheet1', data: [ [Array], [Array], [Array], [Array] ] } ]
            //表单的名字 sheet1的
            const sheetName = workSheetsFromFile.name;
            //这个是excel的表头
            const workTitle = workSheetsFromFile.data[ 0 ];
            //-->这个是建立一个excel文件 ： 生成excel的文件buffer
            //const data111 = workSheetsFromFile.data;
            // var buffer = xlsx.build([{name: "mySheetName", data: data111}]); // Returns a buffer
            // fs.writeFileSync( localUrl + 'userCeshi.xlsx', buffer, 'binary' );
            ctx.body = { code : 200 };
          }
        }
        catch( e ) {
          console.log( 'upExcel-1-->' + e );
          var errCode = { code : 500, errMsg : e.toString() };
          if(e.code) errCode = Object.assign( errCode, e );
          ctx.body = errCode;
        }
      })
    }
    catch( e ) {
      console.log( 'upExcel-2-->' + e );
      var errCode = { code : 500, errMsg : e.toString() };
      if(e.code) errCode = Object.assign( errCode, e );
      this.ctx.body = errCode;
    }
  }
}

module.exports = TemplateController;
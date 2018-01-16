const express = require('express');
let router = express.Router();
const runDao = require('../dao/proDao.js');
const lele = require( '../tool/lele.js')
const _ = require( 'underscore');
const validate = require( 'validate.js' );
const valJson = { presence: true };
module.exports = router;

const request = require( 'request');
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
        /**
         * /错误
         *  errcode: 61011,
            errmsg: 'invalid component hint: [42yX809472994]' }
         */
        /*
        正确的返回结果
        {
            "component_access_token":"61W3mEpU66027wgNZ_MhGHNQDHnFATkDa9-2llqrMBjUwxRSNPbVsMmyD-yq8wZETSoE5NQgecigDrSHkPtIYA", 
            "expires_in":7200
        }
        */
    });
}

var webot = require('webot');

router.get( '/ceshi', function( req, res )
{
	var message = req.query.message;
    message = {
        text : 'hello1111',
        event : 'subscribe11111'
    }
    webot.reply( message, function( err, info )
    {
        if (err) return res.json({ r: err });
        res.json({ r: 0, reply: info.reply });
    });
});
/*
	1。这个菜单列表
	http://cloudstoreapi.eshinetest.cn:10100/sapi/IAccounts/menuAll
	post
	{"brandId":"100001","accountId":"153"}
 */
router.get( '/menuAll', async function( req, res )
{
	try{
		var data = lele.empty( req.query )? req.body : req.query;
		data = {
			p : {
				brandId : '100224',
				accountId : '1022'
			}
		}
		if( lele.empty( data ) || validate( data.p, { brandId: valJson, accountId: valJson } ) )
		{
		    res.json( { 'errMsg' : '数据异常' + data.p });
		    return;
		}
		var brandId = data.p.brandId;
		var accountId = data.p.accountId;
		var accountInfo = await runDao.select( 'account', 'id=' + accountId, 'id,brand_list,role_list');
		if( accountInfo.length == 0 )
		{
		    res.json({ 'errMsg' : "用户不存在" } );
		    return;
		}
		var account = accountInfo[0];
		var roles = lele.empty( account.role_list )? [] : JSON.parse( account.role_list );
		var brands = lele.empty( account.brand_list )? [] : JSON.parse( account.brand_list );
		var brandFlag = _.filter(brands, (item) => {
		    return item.brandId == brandId;
		});
		var roleFlag = _.filter(roles, (item) => {
		    return item.brandId == brandId;
		})
		var brandRoles = _.pluck( roleFlag, "id" );
		var sql = 'select id,name,`keys`,module_list,allow_login_business from account_role where id in(' + brandRoles.join( ',') + ')';
		var rolesInfo = await runDao.query( sql );
		if( lele.empty( rolesInfo ) )
		{
		    res.json( { roles: [], process: 0, rights: [] });
		    return;
		}
		var moduleIds = [];
		rolesInfo.forEach( function( role )
		{
		    var moduleList = role.module_list && JSON.parse( role.module_list );
		    moduleList && moduleList.forEach(( item ) => {
		        moduleIds.push(item.id);
		    })
		});
		var moduleSql = 'select id,type_id,name,routers,icon,sorts from modules where status=1 and id in (' + moduleIds.join( ',' ) + ')';
		var modules = await runDao.query( moduleSql );
		if( modules.length == 0 )
		{
		    return res.json( { roles: roles, process: 0, rights: [] } );
		}
		var moduleTypeIds = _.pluck( modules, 'type_id');
		var modelTypeSql = 'select id,name,icon,client_id,client_name from modules_type where status=1 and id in (' + moduleTypeIds.join( ',' ) + ') order by sorts asc';
		var types = await runDao.query( modelTypeSql );
		var newTypes = [];
		types && types.forEach( ( iType ) =>{
		    var imodules = _.filter(modules, (item) => {
		        return item.type_id == iType.id;
		    })
		    if (!_.isEmpty(imodules)) {
		        iType.modules = imodules;
		        newTypes.push( iType );
		    }
		})
		var cHome = [{ icon: '', id: 0, name: "首页", routers: 'home.index', typeId: 0 }];
		var home = { id: 0, name: "首页", icon: 'http://eshine-image-test.oss-cn-hangzhou.aliyuncs.com/ModuleIcon/主页.png', clientId: 2, clientName: "营运后台系统", modules: cHome };           
		var stores = await runDao.select( 'store', 'brand_id=' + brandId );      
		var shopProcess = 0;
		if( lele.empty( stores ) ) shopProcess = 1;
		newTypes.unshift( home );
		return res.json( { roles: roles, process: shopProcess, rights: newTypes } );
	}
	catch( err )
	{
		res.json({ 'errMsg' : err.toString() });
	}
});

/**
 * 2.员工列表
 * employeeList
 * http://cloudstoreapi.eshinetest.cn:10100/sapi/IAccounts/employeeList
 * {"brandId":"100002","storeId":"330106"}
 */
router.get( '/employeeList', async function( req, res )
{
	var data = lele.empty( req.query )? req.body : req.query;
		data = {
			p : {
				brandId : '100224',
				storeId : '330865'
			}
		}
	var brandId = data.p.brandId;
	var storeId = data.p.storeId;
	var levelId = data.p.levelId || 0;
	var where = { brand_list: { like: '%' + brandId + '%' } };
	var storeAll = ["{\"brandId\":", "\"" + brandId + "\"", ",", "\"storeAll\":1}"].join("");
	var storeList = ["{\"brandId\":", "\"" + brandId + "\"", ",", "\"id\":\"" + storeId + "\"}"].join("");
	where.and = [];
	where.and.push({ or: [{ store_list: { like: '%' + storeList + '%' } }, { brand_list: { like: '%' + storeAll + '%' } }] });
	console.log("where",JSON.stringify( where ));
	res.send( 'oj');
});
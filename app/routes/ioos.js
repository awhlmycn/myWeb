const express = require('express');
let router = express.Router();
const runDao = require('../dao/runDao.js');
const proDao = require('../dao/proDao.js');
const lele = require( '../tool/lele.js')
module.exports = router;

/*
	1.角色列表
	return { status: 1, "result": result }
	post
 */
router.get( '/roleList', async function( req, res )
{
	// var data = req.body;
	// var info = data.p;
	// if( lele.empty( data.p ) || lele.empty( info.brandId ) )
	// {
	// 	console.log(1111);
	// 	res.json( Promise.reject("参数错误") );
	// 	return;	
	// }
	try{
		var resuts = await proDao.select( 'account_role', 'status=1', 'level_id,level_name,`keys`,id' );
		res.json( resuts );
	}
	catch( e )
	{
		res.json( { err : '系统错误'} );
	}
});

/**
 * 2.账号登陆
 * 	mobile : 15305712169
 * 	pwd : 123456
 * 	post
 */
const jwttoken = require( '../tool/jwttoken.js');
const uuid = require('node-uuid');
const validate = require('validate.js');
const moment = require('moment');
var now = moment().startOf('day').unix();
console.log( now );
router.get( '/login', async function( req, res )
{
	var data = req.query;
	data = {
		mobile : '',
		pwd : 123456
	};
	console.log("data",data);
	var exist = { presence: { allowEmpty: false } };
	var key = validate( data, { mobile: exist, pwd: exist });
	console.log( "--->", key);
	if( key )
	{
		console.log(1111111111111);
	}
	// console.log( validate.single("foo", {presence: true, email: true})) ;
	// validate( data,{ mobile: { presence: true }}).then( function( success, error) )
	// {
	// 	console.log( "success", success);
	// });
	// if( validate( data, { mobile: { presence: true }, pwd: { presence: true } })) 
	// {
 //        console.log("IAccount.login request parameter is not correct");
 //        return Promise.reject("参数错误");
 //    }
	var json111 = {
		v1 : uuid.v1(),
		v4 : uuid.v4()
	};
	console.log(2222);
	res.json( json111 );
});
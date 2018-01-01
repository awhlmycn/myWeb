/**
 * http://cloudstoreapi.eshinetest.cn:10100/sapi/IAccounts/accountList
 */
/**
 * 1.员工列表
 */
const express = require('express');
let router = express.Router();
const runDao = require('../dao/proDao.js');
const roleDao = require('../dao/roleDao.js');
const lele = require( '../tool/lele.js');
const validate = require( 'validate.js' );
const jwttoken = require( '../tool/jwttoken.js' );
module.exports = router;
const valJson = { presence: true };


/*
  1.检查用户的手机号
  请求方法 : post
  { p: { mobile: '18817952367' } }
*/
router.all( '/checkAccountByMobile', async function( req, res )
{
    try{
         var data = lele.empty( req.query )? req.body : req.query;
        var mobile = data.p.mobile;
        if( lele.empty( data ) || lele.empty( mobile ))
        {
            res.json( { 'errCode' : 1, 'errMsg' : '手机号不存在'});
            return
        }
        var sql = 'select id from account where mobile="' + mobile + '" limit 1';
        var result = await runDao.query( sql );
        if( result.length == 0 )
        {
            res.json( { 'errCode' : 1, 'errMsg' : '手机号不存在'});
            return
        }
        res.json( { "errMsg": "验证成功", "errCode": 0 } );
    }
    catch( err )
    {
        res.json( { 'errCode' : 1, 'errMsg' : '数据异常' } );
    }
});

/**
 * 1.员工登陆 post
    data { p: { mobile: '18817952367', pwd: 'awhlmycn112125' } }
    返回员工的权限列表
    http://localhost:8080/sapi/IAccounts/login
 */
router.all( '/login', async function( req, res )
{
    try{
        var data = lele.empty( req.query )? req.body : req.query;
        data = { p : { mobile : '18817952367', pwd : 'awhlmycn112125'}};
        if( lele.empty( data ) || lele.empty( data.p ) )
        {
            res.json( { 'errMsg' : '数据异常' + data.p });
            return;
        }
        var dataInfo = data.p;
        if( validate( dataInfo, { mobile: valJson, pwd: valJson } ) )
        {
            res.json( { 'errMsg' : '数据异常' + dataInfo });
            return;
        }
        var accountInfo = await runDao.select( 'account', 'mobile="' + dataInfo.mobile + '"', 'pwd,brand_list,store_list,role_list,login_name,real_name,id');
        if( accountInfo.length == 0 )
        {
            res.json({ 'errMsg' : '用户不存在' });
            return;
        }
        var account = accountInfo[0];
        var clientPwd = lele.md5( dataInfo.pwd );
        if( clientPwd != account.pwd )
        {
            res.json({ 'errMsg' : '登陆密码错误' });
            return;
        }
        var brand_list = lele.empty( account.brand_list )?[] : JSON.parse( account.brand_list );
        var store_list = lele.arrsToObj( lele.empty( account.store_list )? []:JSON.parse( account.store_list ), 'brandId');
        var role_list = lele.arrToObj( lele.empty( account.role_list )? [] : JSON.parse( account.role_list ), 'brandId' );
        var ch_roleInfo = roleDao.getCache( 'account_role', 2, 'id' ); //品牌角色
        var ch_brand = roleDao.getCache( 'brand', 2, 'id' );//品牌角色列表
        var brands = [];
        var brandIds = [];
        brand_list.forEach( function( item )
        {
            item = lele.clone( item );
            item.name = lele.empty( ch_brand[ item.brandId ]) ? '' : ch_brand[ item.brandId ].name;
            item.logo =lele.empty( ch_brand[ item.brandId ]) ? '' : ch_brand[ item.brandId ].logo;
            item.allowLoginBusiness = ch_roleInfo[ role_list[ item.brandId ].id ].allow_login_business == 0 ? false : true;
            item.stores = [];
            if( !lele.empty( store_list[ item.brandId ] ) )
            {
                for( let i = 0; i < store_list[ item.brandId ].length; i++ )
                {
                    item.stores.push( { 'id' : store_list[ item.brandId ][i].id });  
                }
            }
            let sigRole = role_list[ item.brandId ];
            // 一个账号一个品牌只会有一个角色,此为品牌角色信息
            item.roles = [];
            if( !lele.empty( sigRole ) && !lele.empty( ch_roleInfo[ sigRole.id ] ) )
            {
                var option = {
                    'id' : Number( sigRole.id ),
                    'allowLoginBusiness' : ch_roleInfo[ sigRole.id ].allow_login_business,
                    'name' : ch_roleInfo[ sigRole.id ].name,
                    'keys': ch_roleInfo[ sigRole.id ].keys,
                    'becomeTime': ( sigRole.becomeTime ? 0 : sigRole.becomeTime )
                };
                item.roles.push(  option);
            }
            brands.push( item );
            brandIds.push( item.brandId );
        });
        var accInfo = { "mobile": dataInfo.mobile, "login_name": account.login_name, "real_name": account.real_name, "id": account.id };
        var token = await genJWT( account.id, brands );
        var loginToken = await genAllJWT( account.id, brandIds );
        var resultJson = { 'brands' : brands, 'account' : accInfo, 'token': token, 'loginToken' : loginToken };
        res.json( resultJson );
    }
    catch( err )
    {
        res.json( { 'errMsg' : '服务器异常' });
    }
});

/**
 * 2.登陆的token post
 */
router.all( '/loginToken', async function( req, res )
{
    var data = lele.empty( req.query )? req.body : req.query;
    if( lele.empty( data ) || validate( data.p, { token: valJson } ) )
    {
        res.json( { 'errMsg' : '数据异常' + data });
        return
    }
    var token = await jwttoken.decode( data.p.token );
    var id = token.accountId || token.userId; //玩家account_id 唯一标识
    var accountInfo = await runDao.select( 'account', 'id=' + id, 'id' );
    if( accountInfo.length == 0 )
    {
        res.json( { 'errMsg' : 'token验证失败' + id });
        return
    }
    var resultJson = { 'brands' : [], 'account' : '', 'token': '', 'loginToken' : '' };
    res.json( resultJson );
});

/**
 *  3.用户菜单 post
 *  menuAll
 */
router.all( '/menuAll', function( req, res )
{
    var data = lele.empty( req.query )? req.body : req.query;
    if( lele.empty( data ) || validate( data.p, { brandId: valJson, accountId: valJson } ) )
    {
        res.json( { 'errMsg' : '数据异常' + data });
        return;
    }
    var newData = data.p;

});

/**
 * 2.查看员工总数
 * 	method : post
 */
router.all( '/accountCount', function( req, res )
{
	var data = lele.empty( req.query )? req.body : req.query;
    // var clienData = jwttoken.decode( data.);
});





var genJWT = function( accountId, brands )
{
    var payload = genJWTPayload( accountId, brands );
    return jwttoken.encode( payload );
};

var genJWTPayload = function (accountId, brands) {
    return {
        accountId: accountId,
        brands: brands,
        iat: Math.floor(Date.now() / 1000)
    };
};

var genAllJWT = function( userId, brands )
{
    var payload = genAllJWTPayload( userId, brands );
    return jwttoken.encode( payload );
};

var genAllJWTPayload = function( accountId, brands )
{
    return {
        userId: accountId,
        brandIds: brands,
        iat: Math.floor(Date.now() / 1000)
    };
};
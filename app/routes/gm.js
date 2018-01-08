const express = require( 'express' );
let router = express.Router();
const runDao = require('../dao/proDao.js');
const lele = require( '../tool/lele.js')
const validate = require( 'validate.js' );
const valJson = { presence: true };
module.exports = router;

/**
 * 1。查看品牌下面的所有门店
 * { brand_id ：1 }
 * return : []
 */
router.all( '/storeAll', async function( req, res )
{
    var data = lele.empty( req.query )? req.body : req.query;
    if( lele.empty( data ) || validate( data, { brand_id: valJson } ) )
    {
        res.json( { 'errMsg' : 'brand_id没有传过来'});
        return
    }
    try{
        var brand_id = data.brand_id;
        var storeAll = await runDao.select( 'store', 'brand_id=' + brand_id, 'id,brand_id,name,opening_status');
        res.json( storeAll );
    }
    catch( err )
    {
        res.json( { 'errMsg' : err.toString() } );
    }
});

/**
 * 2.查看优惠券
 * 数据库 ： coupon_product
 * id : id
 * brand_id : 品牌id
 * coupon_id ： 优惠券id
 * product_type ： 商品类型  1 ：商品 2 套餐 3 其他   product_type_name ： 商品类型名称
 * product_id ： 产品id
 * scale_id ： 规格id （暂时没用）
 * created ：创建时间
 * 
 * 数据库 ； coupon（ 优惠券 ）
 *    id : 自增长id
 *    brand_id ： 品牌id
 *    store_id ： 门店id
 *    name ： 卷的名称
 *    voucher_type : 卷的类型  1 ：代金券  2 ： 商品券
 *    voucher_type_name ： 券的名称  1 ：代金券  2 ： 商品券
 *    price : 券金额
 *    product_type ： 商品类型 1 ： 商品 2 套餐
 *    product_type_name : 商品类型名字
 *    product_id : 商品id
 *    scale_id ： 规格id（ 不用 ）
 *    start_time : 开始时间
 *    end_time : 结束时间
 *    week ： 星期天数
 *    times : 时间段
 *    day : 自领券后多少天生效
 *    cnt ： 券数量
 *    memo : 备录
 *    status ： 状态 0 未开启 1启用 2 停用 3过期
 *    created ： 创建时间
 *    modified ： 修改时间
 */
/*
    2.展示优惠券列表
    默认是 启用 类型: 全部 门店 全部
    状态 ： 全部、启用、停用、过期
    类别： 全部、现金、商品券
    门店 ： 全部、门店---信息
 */
router.all( '/coupon', async function( req, res )
{
    var data = lele.empty( req.query )? req.body : req.query;
    if( lele.empty( data ) || validate( data, { brand_id: valJson } ) )
    {
        res.json( { 'errMsg' : 'brand_id没有传过来'});
        return
    }
    var type = data.type;
    try{
        var couponList = await runDao.select( 'coupon', );
    }
    catch( err )
    {
        res.json( { 'errMsg' : err.toString() });
    }
});



/**
 * 1.账号登陆
 * 这里要返回token
 */
router.all( '/gmLogin', function( req, res )
{
    var data = lele.empty( req.query )? req.body : req.query;
    if( lele.empty( data ) || validate( data, { mobile: valJson, pwd: vaJson } ) )
    {
        res.json( { 'errMsg' : 'brand_id没有传过来'});
        return
    }
    var mobile = data.mobile;
    try{
        var roleInfo = await runDao.select( 'gm_account', 'pwd,brand_list,store_list,role_id' );
        if( roleInfo.length == 0 )
        {
            res.json( { 'errMsg' : '账号不存在' });
            return;
        }
        roleInfo = roleInfo[0];
        var clientPwd = lele.md5( data.pwd );
        if( clientPwd != roleInfo.pwd )
        {
            res.json( { 'errMsg' : '密码不正确' });
            return;
        }
        // 返回他所拥有的品牌
        
    }
    catch( err )
    {
        res.json( { 'errMsg' : err.toString() });
    }
    
    
});
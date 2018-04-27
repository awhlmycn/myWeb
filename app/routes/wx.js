const express = require( 'express' );
let router = express.Router();
const runDao = require('../dao/dbDao.js');
const lele = require( '../tool/lele.js')
const validate = require( 'validate.js' );
const valJson = { presence: true };
const logger = require( '../tool/log4.js').getLogger( 'log_wx' );
const xmlparser = require( 'xmlparser');

module.exports = router;

/*
    1.验证消息是否来自于微信服务器
*/
router.get( '/:platform/wx', function( req, res )
{
    var platform = req.params.platform;
    wxInfo.VerWeixin( req, res, platform );
} )

/*
    2.手动去刷新accessToken和jsApiTicket
*/
router.get( '/:platform/updatetoken', function( req, res )
{
    var platform = req.params.platform;
    if( platform == undefined )
    {
        res.send( 'updatetoken is failed' );
        return;
    } 
    wxApi.upAccessToken( platform );
    res.send( 'updatetoken is success');
});

/*
    3.初始化公众号的菜单页面
*/
router.get( '/:platform/initMenu', function( req, res ) 
{
    var platform = req.params.platform;
    if( platform == undefined )
    {
        res.send( 'initMenu is failed' );
        return;
    } 
    wxInfo.initMenu( res, platform );
});

/*
    4.接受来自于页面的请求
*/
router.post( '/:platform/wx', xmlparser( { trim: false, explicitArray : false } ), function( req, res )
{
    var platform = req.params.platform;
    if( platform == undefined )
    {
        res.send( 'success' );
        return;
    }
    var xmlData = req.body.xml;
    if( lele.empty( req.body ) )
    {
        res.send( 'success' );
        return;
    }
    wxInfo.MsgReply( xmlData, res, platform );
});

/*****************************处理前端的功能页面请求*****************************/

/*
    1.通用的页面跳转
    action : user
             game
             purchase
             redpak
             getflow
             shareflow
             zhuanpan
             360vedio
             cinemavideo
             sign
             shop

*/
router.get( '/jump/:platform/:action', function( req, res )
{
    var platform = req.params.platform;
    var action = req.params.action;
    if( platform == undefined || action == undefined )
    {
        res.send( 'speak is failed' );
        return;
    }
    res.redirect( '/' + platform + '/wxsignup/' + action );
});

/*
    2.直接跳转网页
    360,3d,buy,
*/
router.get( '/jumpWeb/:platform/:action', function( req, res )
{
    var action = req.params.action;
    switch( action )
    {
        case '360':
            res.redirect( 'http://video.vlavr.com/360video.html' );
        break;
        case '3d':
            res.redirect( 'http://video.vlavr.com/cinemavideo.html' );
        break;
        case 'buy':
            res.redirect( 'http://mp.weixin.qq.com/bizmall/mallshelf?id=&t=mall/list&biz=MzAxNTM4NDI2Mw==&shelf_id=1&showwxpaytitle=1&uin=&key=&version=26031e30&lang=zh_CN' );
        break;
        case 'tips':
            res.render( 'tips' );
        break;
        default:
            res.send( "web is not exist" );
        break;
    }
});

/*
    3.处理网页请求来获取code，并且来获取玩家的基本信息

    网页授权获取用户基本信息
    如果用户在微信客户端中访问第三方网页，公众号可以通过微信网页授权机制，来获取用户基本信息
    用户同意授权，获取code
*/
router.get( '/:platform/wxsignup/:path', function( req, res )
{
    var platform = req.params.platform;
    var wxBase = wxApi.getWxBase( platform );
    if( lele.empty( wxBase ) )
    {
        res.send( 'platform数据有误', + platform );
        return;
    }
    var path = req.params.path;
    var urlWXsignup = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + wxBase.appID + "&redirect_uri=" + wxBase.code_url + '/wxuser/'+ path + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    res.redirect( urlWXsignup );
});

/*
    4.通过code换取网页授权access_token
    并且获取玩家的基本信息
*/
router.get( '/:platform/wxuser/:path', function( req, res )
{
    var platform = req.params.platform;
    var path = req.params.path;
    var code = req.query.code;
    wxInfo.getTokenAccess( path, code, res, platform, {
        url : 'http://' + req.headers.host + req.url,
        ip : lele.getClientIp( req )
    } );
});


/*
    
    1.  weixin 支付处理
    创建订单
    传递给微信的单位都是分
    {
        shop_id : 1  //商品的列表id
        openid: 'oTGkwv96AnYZtRL1c1U2FhIXnILg', //玩家唯一标识
        platform : 'eshine'  //平台名字 现在默认eshine
    }
    https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_1
    https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_1
*/
var shopList = { 1: 50, 2:100, 3 : 150 };
var wxBase = {
    "app_id":"wxa31a6a54e5b6a0b6",
    "mch_id" : 1488594872,
    "nonce_str" : 'ibuaiVcKdpRxkhJA',
    "pay_key" : 'shanghaimorenzhifuzhanghao201801'
};
router.all( '/purchase', function( req, res )
{
    var ip = lele.getIp();
    return res.json({ code : ip });

    var data = lele.empty( req.query )? req.body : req.query;
    data.openid = 'ovzp40U-V8_my3_o_6lCOm0AhLUo';
    if( lele.empty( data ) || validate( data, { shop_id: valJson, openid: vaJson } ) )
    {
        res.json( { 'errMsg' : data.toString() });
        return
    }
    if( !lele.haskey( shopList, data.shop_id ) )
    {
        res.json( { 'errMsg' : '商品不存在' } );
        return
    }
    var platform = 'eshine';
    var openid = data.openid;
    var fee = lele.intval( shopList[ data.shop_id ] );//代表充值的多少钱
    var out_trade_no = lele.uniqueIden() + fee; //生成订单号
    var total_fee = fee * 100 ;//正式fee*100 单位 : 分
    var bodyStr = '合伙人充值';
    var goodDetail = {
        goods_id    : "coin" + fee,   //必填 32 商品的编号
        wxpay_goods_id  : "100" + fee,          //支付定义的统一商品编号
        goods_name  : fee + '合伙人充值', //商品名称
        quantity    : fee,                  //商品数量
        price   : total_fee ,               //商品单价, 正式fee*100 
        goods_category : '1',               //商品类目
        body: '充值' + fee + '合伙人充值' //商品描述信息
    };       
    var detail = { goods_detail: goodDetail  };
    // 下订单的参数
    var ret = {
        appid       :   wxBase.app_id,   //微信开放平台审核通过的应用APPID
        mch_id      :   wxBase.mch_id,   //微信支付分配的商户号
        nonce_str   :   wxBase.nonce_str,   //随机字符串
        body        :   bodyStr,        //商品描述交易
        detail      :   detail,             //商品详情
        attach      :   '唯辣VR',             //附加数据
        out_trade_no : out_trade_no,        //商户系统内部的订单号
        total_fee   :   total_fee,          //订单总金额，单位为分
        spbill_create_ip : lele.getIp(),    //用户端实际ip
        notify_url  :   wxBase.notify_url,  //接收微信支付异步通知回调地址
        openid      :   openid,             //玩家的id
        trade_type  : 'JSAPI'               //支付类型
    };
    // 1.拼接签名
    var signData = [];
    for( var keyV in ret )
    {
        signData.push( keyV + '=' + ret[ keyV ] );
    }
    signData = signData.sort().join( '&' );
    // 2.拼接字符串密钥
    signData += '&key=' + wxBase.pay_key;   //用于签名用
    // 3.对所有参数进行md5签名,并变成大写
    var sign = lele.md5( signData ).toUpperCase();
    //创建订单
    var jsurl = bodyInfo.jsurl;         //当前网页的jsurl
    ret.sign = sign;
    ret.key =  wxBase.pay_key;      //用于签名用;
    ret.mobile = mobile;  //用于记录哪个手机号充的值;
    wxInfo.createOrder( jsurl, res, ret, platform );
});


/*
    2.微信服务器通知付款成功
*/
// router.post( '/:platform/purchase/callback', xmlparser( { trim : false, explicitArray : false } ), function( req, res )
// {
//     var platform = req.params.platform;
//     var body = req.body.xml;
//     wxInfo.achieveOrder( res, body, platform );
// });

/*
    3.前端提示购买成功
*/
// router.get( '/:platform/purchase/success', function( req, res )
// {
//     var data = req.query;
//     var fee = data.fee;
//     var platform = req.params.platform;
//     var openid = data.openid;
//     var total_val = lele.intval( lele.getCommon( 'coinRate', true )[ fee ] );
//     res.render( 'recharge_success', { platform: platform, fee : fee, total_val : total_val } );
// });

/*
    4.购买失败的时候
*/
// router.get( '/:platform/purchase/failed', function( req, res )
// {
//     var platform = req.params.platform;
//     var data = req.query;
//     var order = data.order;
//     var type = lele.intval( data.type ) || 1;
//     var aUrl = wxApi.rechargeUrl( 1, platform );
//     if( type == 2 ) aUrl = wxApi.rechargeUrl( 2, platform );
//     res.render( 'recharge_error', { orderId : order, aUrl : aUrl } );
// });


/*
    8.创建订单
    jsUrl : 当前网页的url 用于JS-SDK使用权限签名算法
*/
// wX.createOrder = function( jsUrl, res, ret, platform )
// {
//     var wxBase = wxApi.getWxBase( platform );
//     var buy_failed = wxBase.buy_failed;
//     var formData  = '<xml>';
//         formData  += '<appid>' + ret.appid + '</appid>';  //appid
//         formData  += '<attach>' + ret.attach + '</attach>'; //附加数据
//         formData  += '<body>' + ret.body + '</body>';
//         formData  += '<detail><![CDATA[' + ret.detail + ']]></detail>';  //商品详情
//         formData  += '<mch_id>' + ret.mch_id + '</mch_id>';  //商户号
//         formData  += '<nonce_str>' + ret.nonce_str + '</nonce_str>'; //随机字符串，不长于32位。
//         formData  += '<notify_url>' + ret.notify_url + '</notify_url>';
//         formData  += '<openid>' + ret.openid + '</openid>';
//         formData  += '<out_trade_no>' + ret.out_trade_no + '</out_trade_no>';
//         formData  += '<spbill_create_ip>' + ret.spbill_create_ip + '</spbill_create_ip>';
//         formData  += '<total_fee>' + ret.total_fee + '</total_fee>';
//         formData  += '<trade_type>JSAPI</trade_type>';
//         formData  += '<sign>' + ret.sign + '</sign>';
//         formData  += '</xml>';
//     async.waterfall([
//         function( cb )
//         {
//             // 统一下单地址
//             var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
//             nodeWeixinRequest.xml( url, formData, cb );
//         },
//         function( result, cb )
//         {
//             //如果验证通过
//             if( result.return_code == "SUCCESS" && result.result_code == "SUCCESS" )
//             {
//                 //JS-SDK权限验证的签名 查看附录1-JS-SDK使用权限签名算法
//                 var jstiket = wxApi.getToken( 2, platform );
//                 var signDataJS  = '';
//                     signDataJS += 'jsapi_ticket=' + jstiket;
//                     signDataJS += '&noncestr=' + ret.nonce_str;
//                     signDataJS += '&timestamp=' + lele.getTime();
//                     signDataJS += '&url=' + jsUrl;
//                 var jssign = lele.sha1( signDataJS );
//                 console.log("back to client~~~~~~~~~~~~~~~~");
//                 //生成支付签名
//                 var paySignStr = "";
//                 paySignStr += 'appId=' + ret.appid;
//                 paySignStr += '&nonceStr=' + ret.nonce_str;
//                 paySignStr += '&package=prepay_id=' + result.prepay_id;  //预支付交易会话标识
//                 paySignStr += '&signType=MD5';
//                 paySignStr += '&timeStamp=' + lele.getTime();
//                 paySignStr += '&key=' + ret.key;
//                 var paySign = lele.md5( paySignStr ).toUpperCase();
//                 var payData = {
//                     appid : ret.appid,
//                     timeStamp : lele.getTime(),
//                     nonceStr : ret.nonce_str,
//                     prepay_id : result.prepay_id,
//                     jssign : jssign,
//                     paySign : paySign
//                 };
//                 res.send( payData );
//                 var insert_data = {
//                     openid : ret.openid,
//                     goodsId : ret.out_trade_no,
//                     price :  ret.total_fee/100,  //代表的是充值的钱
//                     createTime : lele.getTime(),
//                     platform : platform,
//                     status : 0,
//                     mobile : ret.mobile,
//                     goodDetail : JSON.stringify( ret.detail.goods_detail ) //商品的详情
//                 };
//                 runDao.insert( 'goodsOrder', insert_data, cb );
//                 return;
//             }
//             res.send( { code : 500 } );
//             // res.redirect( buy_failed ); //'/purchase/failed'
//         }
//     ], function( err )
//     {
//         if( err )
//         {
//             res.send( { code : 500 } );
//             return;
//             // res.redirect( buy_failed );
//         }
//     });
// };

/*
    9.完成订单
    total_fee : 为分 
*/
// wX.achieveOrder = function( res, body, platform )
// {
//     var total_fee = lele.intval( body.total_fee );
//     var goodsId = body.out_trade_no;
//     var openid = '';
//     var sql = 'goodsId="' + goodsId + '" AND platform="' + platform + '"';
//     var mobile = '';
//     async.waterfall( [
//         function( cb )
//         {
//             runDao.select( 'goodsOrder', sql, 'status,openid,mobile', cb );
//         },
//         function( res, cb )
//         {
//             if( res.length == 0 || res[0].status != 0 )
//             {
//                 logger.error( '[function-achieveOrder-1]' + total_fee, platform, openid, goodsId );
//                 cb( 'the goodsId has used' );
//                 return;
//             }
//             mobile = res[0].mobile;
//             openid = res[ 0 ].openid;
//             if( mobile.length > 0 )  //玩家进行流量充值活动
//             {
//                 // total_fee = 1000;  //ceshi
//                 var exchange_num = lele.intval( lele.getCommon( 'ex_flow', true )[ total_fee/100 ] );
//                 if( exchange_num == undefined ) exchange_num = 100;
//                 roleDao.rechargeFlow( exchange_num, platform, openid, mobile, cb );
//                 return;
//             }
//             var rechargeNum = total_fee/100;  //充值的钱
//             var coinRate = lele.getCommon( 'coinRate', true ); //商品的兑换比例
//             if( !coinRate.hasOwnProperty( rechargeNum ) )
//             {
//                 logger.error( '[function-achieveOrder-2]' + total_fee, platform, openid, goodsId );
//                 cb( 'parameter is failed' );
//                 return;
//             }
//             total_fee = lele.intval( coinRate[ rechargeNum ] );
//             tlogDao.clickflow( { 'type': 9, 'openid' :openid, 'platform':platform, 'num' : total_fee } );
//             runDao.update( 'role', { 'coin' : 'coin+' + total_fee }, 'openid="' + openid + '"', cb );
//         },
//         function( result, cb )
//         {
//             var update_info = {
//                 status : 1,
//                 closeTime : lele.getTime()
//             };
//             runDao.update( 'goodsOrder', update_info, sql, cb );
//         },
//     ], function( err )
//     {
//         if( err )
//         {
//             console.log( "achieveOrder is failed", err );
//             logger.error( '[function-achieveOrder-3]' + err );
//             // var newUrl = wxApi.rechargeUrl( 1, platform );
//             // if( mobile.length > 0 ) newUrl = wxApi.rechargeUrl( 2, platform );
//             // res.send( 'success' );
//             // res.render( 'recharge_error', { orderId : goodsId, aUrl : newUrl });
//             // res.redirect( buy_failed + '?orderId=' + goodsId + '&aUrl=' + newUrl );
//             // return;
//         }
//         console.log( "achieveOrder is success" );
//         res.send( 'success' );
//     });
// };
var _ = require( 'underscore' );
var crypto = require( 'crypto' ); //加密模块
var querystring = require( 'querystring' );
var lele = module.exports;


/**
*   1. partition 对数组进行拆分为俩个数组_partition
*   2. compact 返回一个出去所有特殊类型的（false）的array副本_.compact
*   3. flatten 将一个多维数组变成一维数组 _flatten( [], true) 第二个参数则只去掉一层
*   4. map 和mapObject对obj或者数组进行值得转换
*   5. pick 对对象（obj）进行过滤的
 */

/**
 * 1.对数组或者json对象进行求和
 * @param obj : arr, json
 *  arr :  [1,3,4], json : {one: 1, two: 2, three: 3}
 * @return 20
 */
lele.sum = function( obj )
{
    var sumTotal = _.reduce( obj, function( sum, num, index )
    {
        return parseInt( sum ) + parseInt( num );
    });
    return sumTotal;
};

/**
 * 2.获取一个json数组的属性值
 * @param obj :[{name: 'moe', age: 40}, {name: 'larry', age: 50}];
 * return arr [moe, larry ]   pluck : 摘下
 */
lele.pluck = function( obj, key )
{
    var arr = _.pluck( obj, key );
    return arr;
};

/**
 * 3.返回一个对象中某个最大的值
 * @param obj :[{name: 'moe', age: 40}, {name: 'larry', age: 50}];
 * @param return :{name: 'moe', age: 40}; 只能是数字
 */
lele.objMax = function( obj, key )
{
    var sigObj = _.max( obj, function( sigInfo )
    {
        return sigInfo[ key ];
    });
    return sigObj;
}

/**
 * 4.返回一个对象中某个最小的值
 * @param obj :[{name: 'moe', age: 40}, {name: 'larry', age: 50}];
 * @param return :{name: 'moe', age: 40};  只能是数字
 */
lele.objMin = function( obj, key )
{
    var sigObj = _.min( obj, function( sigInfo )
    {
        return parseInt( sigInfo[ key ] );
    });
    return sigObj;
}

/**
 * 5.返回一个数组中的最大值
 * @param  {[type]} arr [ 1,2,3,4,5]
 * @return 5 最大的一个值
 */
lele.arrMax = function( arr )
{
    var sigObj = _.max( arr, function( num )
    {
        return parseInt( num )
    } );
    return sigObj;
}

/**
 * 6.返回一个数组中的最小值
 * @param  {[type]} arr [ 1,2,3,4,5]
 * @return 5 最大的一个值
 */
lele.arrMin = function( arr )
{
    var sigObj = _.min( arr, function( num )
    {
        return parseInt( num )
    } );
    return sigObj;
}

/*
    7.对数据进行排序
    arr : 数组 [{ 'name' : 1},{'name' : 2 }]
    key : 按照什么来排序  默认为升序
*/
lele.sortBy = function( arr, key, rule )
{
    var newArr = _.sortBy( arr, key );
    if( rule == 'desc' ) //降序
    {
        newArr.reverse();  //该方法会改变原来的数组，而不会创建新的数组
    }
    return newArr;
};

/**
 *  8.数组中包含多个相同key的数据，重组数据
 * @param   arr  [ { 'role_id':1, 'k':1 }, { 'role_id':1, 'k':2 } ]
 * @param   return { 1: [ { 'role_id':1, 'k':1 }, { 'role_id':1, 'k':2 } ] }
 */
lele.arrsToObj = function( arr, key )
{
    var _obj =  _.groupBy( arr, key );
    return _obj;
};

/**
    9.适用于key值不重复的arr数据
 * @param   arr  [ { 'role_id':1 }, { 'role_id':2 } ]
 * @param   return { '1': { role_id: 1 }, '2': { role_id: 2 } }
 */
lele.arrToObj = function( arr, key )
{
    var _obj =  _.indexBy( arr, key );
    return _obj;
};

/**
    10.把json数据变为arr
 * @param   return { '1': { role_id: 1 }, '2': { role_id: 2 } }
 * @param   arr  [ { 'role_id':1 }, { 'role_id':2 } ]
 */
lele.objToArr = function( obj )
{
    var arr =  _.toArray( obj );
    return arr;
};
/**
    11.打乱一个数组
 * @param   arr  [ 1,2,3,4,5 ]
 * @param   newArr
 */
lele.shuffle = function( arr )
{
    var newArr =  _.shuffle( arr );
    return newArr;
};

/**
    12.返回一个len 或者数组的长度
 * @param   arr  [ 1,2,3,4,5 ] obj { one:1, two:2}
 * @return   length
 */
lele.objLength = function( obj )
{
    var length =  _.size( obj );
    return length;
};

/**
    13.返回一个唯一的数组, 去重、过滤数组
 * @param   arr  [ 1,2,3,4,5,1 ] obj { one:1, two:2 }
 * @return   length
 */
lele.arrFilterUniq = function( arr )
{
    var _arr =  _.uniq( arr, true );
    return _arr;
};

/**
 * 14.把数组变成object
 * 第一种 : ['moe', 'larry', 'curly'], [30, 40, 50]
 * 第二种 : [['moe', 30], ['larry', 40], ['curly', 50]]
 * return : {moe: 30, larry: 40, curly: 50}
 */
lele.arrMergeObj = function( arr, arr1 )
{
    var _obj = null;
    if( arr1 && arr1.length > 1 ){
        _obj = _.object( arr, arr1 );
        return _obj;
    }
    _obj = _.object( arr );
    return _obj;
};

/**
 * 15.返回在数组中的index
 * @param  arr, key
 * @return index
 */
lele.index = function( arr, key )
{
    var index = _.indexOf( arr, key );
    return index;
};

/**
 * @16.创建一个列表函数
 * @rand ： 一个用来创建整数灵活编号的列表的函数
 * @param : start ,stop ,step
 * eg: _.range(10); return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        
 */
lele.creatArr = function( start, stop, step )
{
    step = step || 1;
    var arr = _.range( start, stop, step );
    return arr;
};

/**
 * 17.[arrClear description]
 * @param  arr 数组
 * @param  value 移除的某个值
 * @return  移除后的新数组  
 */
lele.arrClear = function( arr, value )
{
    var newArr = _.without( arr, value );
    return newArr;
};

/**
 * 18.arrDel 移出arr里的某一位
 * @param  {[type]} arr [description]
 */
lele.arrDel = function( arr, n )
{
    if( n < 0 )
    {
        return arr;
    } 
    else {
        //arr.splice( index, 1 );  在原数组上面进行删除
        return arr.slice( 0, n ).concat( arr.slice( n + 1, arr.length ) );
    }
};

/**
 * 19.addArrEle 增加数组的某一位
 * @param  {[type]} arr [description]
 *         start_index : 在某个地方增加的值 
 *         str 插入的数据
 */ 
lele.addArrEle = function( arr, start_index, str )
{
    arr.splice( start_index, 0, str );
};

/**
 * 20.返回一个除去所有false值的 array副本。 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
 * @param  arr 数组  去除数组中的 特殊字段
 * @return {[type]}     [description]
 */
lele.delEmptyObject = function( arr )
{
    var newArr = _.compact( arr );
    return newArr;
};

/**
 * 21.随机出一个数组的值出来
 * @param  arr 数组  num  随机多少个数字    当num>1的时候为一个数组
 * @return number  或者 [ 1, 2 ]
 */
lele.randomArrVal = function( arr, num )
{
    if( num > 0 ) return _.sample( arr, num ); //返回数组
    var newArr = _.sample( arr );
    return newArr;
};

/**
 * 22.俩个数组的合并
 * @param  month  : 1~~12
 */
lele.arrMergeArr = function( arr, arr1 )
{
    var newArr = arr.concat( arr1 );
    return newArr;
};

/**
 * 23.俩个数组的合并 去除重复的
 * @param  month  : 1~~12
 */
lele.arrIntersection = function( arr, arr1 )
{
    var newArr = _.intersection( arr, arr1 );
    return newArr;
};

/**
 * 24.俩个数组的并集 去除重复的
 * @param  arr   arr1 
 */
lele.arrUnion = function( arr, arr1 )
{
    var newArr = _.union( arr, arr1 );
    return newArr;
};





/***************************************Objects对象篇********************************************/
/**
 * @ 1.返回所有object的key值()
 * @param  obj
 * return [];
 */
lele.keyArr = function( obj )
{
    var arr = _.keys( obj );
    return arr;
};

/**
 * @ 2.返回对象的所有值
 * @param  {one: 1, two: 2, three: 3}
 * return [1, 2, 3];
 */
lele.objVals = function( obj )
{
    var _objValArr = _.values( obj );
    return _objValArr;
};

/**
 *  3.对象的合并
 *  @{"key":1}  {"name":2}  接受多个对象
 *  return  第一个对象
 */
lele.objMergeObj = function( obj1, obj2 )
{
    var newObj = _.extendOwn( obj1, obj2 );
    return newObj;
};

/**
 * 4.对对象进行拷贝
 * @param arr 或者obj
 */
lele.clone = function( obj )
{
    var newObj = _.clone( obj );
    return newObj;
};

/**
 * 5.对象中是否有这个key值
 * @param arr 或者obj
 */
lele.hasKey = function( obj, key )
{
    var isHas = _.has( obj, key );
    return isHas;
};

/**
 * 6.判断俩个对象是否深层次的相等
 * @param obj  obj
 * @return  false || ture
 */
lele.isEqual = function( obj1, obj2 )
{
    var equal = _.isEqual( obj1, obj2 );
    return equal;
};

/**
 * 7.判断tmpObj 是否在obj中存在
 * 判断obj 中是否有tmpObj  这个属性值 
 * @param  obj {name: 'moe', age: 32}  tmpObj {age: 32}
 * @param  obj [1,2,3,4,5]  tmpObj 5
 * 或者检查一个数是否在数组中
 * @return  false || ture
 */
lele.isInArray = function( obj, tmpObj )
{
    var isMatch = _.isMatch( obj, tmpObj );
    return isMatch;
};

/**
 * 8.判断这个obj是否是空的
 * @param obj
 * @return  false || ture
 */
lele.empty = function( obj )
{
    if( !isNaN( obj )) return false;  //数字的时候不是空的
    var is_empty = _.isEmpty( obj );
    return is_empty;
};

/**
 * 9.判得到一个 min 和 max中的随机整数
 * @param min   max  如果max是数组的长度请自行减一 
 * @return  num
 */
lele.random = function( min, max )
{
    var num = _.random( min, max )
    return num;
};

/**
 *  10.获取当前的时间戳，毫秒级
 */
lele.getTime = function( isSecond )
{
    var time = _.now(); // == new Date ).getTime()
    if( isSecond ) return time; //返回毫秒数
    time = Math.floor( time/1000 );
    return time;
};

/**
 *  11 转化为年月日 hms 存在就加上秒
 *  @param str  加密字符串  d 为时间戳 秒
 */
lele.Format = function( hms, d )   
{
    var date = d ? new Date( d * 1000 ) : new Date();
    var str = date.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate();
    if(hms)
    {
        str += ' ' + date.getHours() + ':' +  date.getMinutes() + ':' + date.getSeconds();
    }
    return str;
};

/**
 *  12.字符串的过滤
 *  @param str  字符串
 *  return str  过滤好的字符串
 */
lele.filterStr = function( str )
{
    str = str.replace( /\s+/g, "" ); //去除空格 
    str = str.replace(/[&\+\-\_\=\n\r\|\\\*!()=<>~`\/,.^%$#@\-]/g,"");
    return str;
};

/**
 *  13.64位的字符串编码
 *  @param str  字符串
 *  return str  编码后的字符串
 */
lele.base64Encode = function( str )
{
    return new Buffer( str ).toString( 'base64' );
};

/**
 *  14.64位的字符串解码
 *  @param str  字符串
 *  return str  解码后的字符串
 */
lele.base64Decode =  function( str ) 
{
    return new Buffer( str, 'base64' ).toString();
};

/**
 *  15 hmac 的加密
 *  @param str  加密字符串 key : 加密的key
 */
lele.hmac = function( str, key )
{
    if( lele.empty( str ) ) return '';
    return crypto.createHmac( 'sha1', key ).update( str ).digest( 'hex' );
};

/**
 *  16 md5 的加密
 *  @param str  加密字符串
 */
lele.md5 = function( str ) 
{
    if( lele.empty( str ) ) return '';

    return crypto.createHash( 'md5' ).update( str, 'utf8' ).digest('hex');
};

/**
 *  17 sha1 的加密
 *  @param str  加密字符串
 */
lele.sha1 = function( str ) 
{
    if( lele.empty( str ) ) return '';

    return crypto.createHash( 'sha1' ).update( str, 'utf8' ).digest( 'hex' );
};

/**
 * 18. 将字符串变成数组
 * @param   str字符串 splitStr 将字符串以某种符号进行分开
 * @return arr
 */
lele.strToArr = function( str, splitStr )
{
    return str.split( splitStr );
};

/*
    19.对多维字符串进行转化
    old_str = '' 或者 '1:1' 或者 '1:1|2:1'
    splitStr1  为 | splitStr2  为 :   没有就为空字符串
    二维的str '1:1|2:1'  变为json对象
    更新key的值  value 为值  type  1 : 为得到 obj对象  2 为更新对象值
*/
lele.strToObj = function( type, old_str, splitStr1, splitStr2, key, value )
{
    var obj = lele.clone( querystring.parse( old_str, splitStr1, splitStr2 ) );
    if( type == 1 ) return obj;
    obj[ key ] = value;
    var new_str = querystring.stringify( obj, splitStr1, splitStr2 );
    return new_str;
};

/**
 * 20.获取零点时间
 * @type {String}  t : 时间戳 单位秒
 * type  1 为 获取的是秒
 */
lele.zeroTime = function ( t, type )
{
    type = type || 1;
    var date = lele.empty( t )? new Date() : new Date( t * 1000 );
    var m = date.getMonth() + 1;
    var zstr = date.getFullYear() +'/'+ m +'/'+ date.getDate();
    var zt = new Date( zstr ).getTime();
    return type == 1 ? Math.floor( zt / 1000 ) : zt;
};

/**
 * 21.获取随机字符串
 * @param len  为获取的字符串长度
 * @return str
 */
lele.randomString = function( len )
{
    len = len || 32;
    var chars = [ '0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', 'a', 'b', 'c', 'd', 'c', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
    var res = '';
    for(var i = 0; i < len ; i ++) 
    {
        res +=  chars[ lele.random( 0, chars.length -1 ) ];
    }
    return res;
};



/**
 * 22.获取月份中最大的一天
 * @param  month  : 1~~12
 */
lele.monthMaxDay = function( month )
{
    var d = new Date();
    return new Date( d.getFullYear(), month, 0 ).getDate();
};



/**
 * 23.判断俩个日期 是不是同一天
 * @ tDo  tdw  俩个日期的时间戳
 */
lele.notSomeDay = function( tdo, tdw )
{
    var d1 = new Date( tdo * 1000 );
    var d2 = new Date( tdw * 1000 );
    if( d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate() )
    {
        return true;
    }
    return false;
};






// var redisStore = require('connect-redis')( session );
    // app.use( session({
    //     // 假如你不想使用 redis 而想要使用 memcached 的话，代码改动也不会超过 5 行。
    //     // 这些 store 都遵循着统一的接口，凡是实现了那些接口的库，都可以作为 session 的 store   使用，比如都需要实现 .get(keyString) 和 .set(keyString, value) 方法。
    //     // 编写自己的 store 也很简单
    //     store: new redisStore(),
    //     secret: 'somesecrettoken',
    //     name : 'aaaa',
    //     resave: false,
    //     saveUninitialized: true,
    //     cookie: { secure: false, maxAge: 7*3600000 }
    // }));
    // var session = require( 'express-session' );
    // var SessionStore = require('connect-mongo')(session)
    //  app.use( '/shop', session( {
    //     // name : 'aaaa',
    //     secret: 'vlavr-shop',
    //     resave: false,
    //     saveUninitialized: true,
    //         store : new SessionStore({
    //                   url: "mongodb://localhost/db_session",
    //                   collection : 'sessions',
    //                   interval: 120000 // expiration check worker run interval in millisec (default: 60000)
    //              }),
    //     cookie: { secure: false, maxAge: 100000, Domain : '139.196.215.224'}
    // }))

    //对shop底下的绑定session
    // app.use( '/shop', session( {
    //     secret: 'vlavr-shop',
    //     saveUninitialized: false,  // 当 其设置为true的时候  即在设定时间过的时候就失效，resave和rolling不存在
    //     resave:true,               //当resave和rolling存在的时候 他们代表的是会话一直在操作的时候，他就会更新过期时间
    //     rolling:true,
    //     store : new SessionStore({}, global.tlogDB.pool ),
    //     cookie: { secure: false, maxAge : 1800 * 1000 }
    // }))
    // //这个是微信商城的
    // app.use( '/shop', require( '../routes/shop.js' ) );

    // app.use('/ssh', require('redirect-https')({
    //     body: '<!-- Please use HTTPS ! -->'
    // }));

    // app.use( '/ssh', require( '../routes/ssh.js' ) );

    /*
        1.背景图片全屏 ： <div><img style="position:absolute;width:100%;height:100%;z-Index:-1;" src="./liuliang_12.jpg" /></div>
     */ 
//https://www.cnblogs.com/jkll/p/4550080.html
var redis = require( 'redis' );
var REDIS_HOST = 'redis.eshinetest.cn';
var REDIS_PORT = 6379;
var redisClient = redis.createClient( { host: REDIS_HOST, port: REDIS_PORT});


redisClient.on( 'ready', function()
{
    console.log('ready');
});
redisClient.on( 'connect', function()
{
    console.log( 'connect is ok');
    // redisClient.set( 'hello', "{ 'hello' : 'nihao', 'ceshi' : 'hisOk'}");
});
redisClient.on('error', function( error )
{
    console.log(error);
});

// redisClient.set( 'he111', JSON.stringify( 'hjhjshda' ) );
redisClient.get( 'hello', function( err, data )
{
    console.log( data );
});

// redisClient.hmset( 'his', {1 : 2, 3 : 5});
redisClient.hgetall( 'his', function( err, data )
{
    console.log("data1", data );
});


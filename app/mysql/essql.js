var elasticsearch = require( 'elasticsearch' );

var esSql = function( url )
{
    url = 'http://kuzzle.eshinetest.cn:19200/';
    var esclient = new elasticsearch.Client({ host: url });
    console.log( "esclient", esclient );
};
module.exports = esSql;
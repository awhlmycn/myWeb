var mysql = require( 'mysql' );
var async = require( 'async' );
var lele = require( '../tool/lele.js');
// var logger = require( __dirname +'/../tool/log4.js').getLogger( 'log_dao' );

var YY = function( limit, data_name, mysqlConfig )
{
    this.pool = null;
    this.init( limit, data_name, mysqlConfig );
};

module.exports = YY;


YY.prototype.init = function( limit, data_name, mysqlConfig ) {
    this.pool = mysql.createPool( {
        host : mysqlConfig.host,
        port : mysqlConfig.port,
        user : mysqlConfig.user,
        password : mysqlConfig.password,
        database : mysqlConfig[ data_name ],
        connectionLimit : limit
    });
};

//单条sql执行方法
YY.prototype.query = function( sql )
{
	if( !sql )
    {
    	Promise.reject( 'sql is not exsit' )
        return;
    }
    let that = this;
	return new Promise( function( resole, reject )
	{
	    that.pool.getConnection( function( err, connection )
    	{
    		if( err )
    		{
	            reject( err );
	            return;
	        }
	        connection.query( sql, function( err, result )
	        {
	        	connection.release();
	        	if( err )
	        	{
	        		reject( err );
	        		return;
	        	}
	        	resole( result );
	        });
    	});
	});    
};

//插入数据
YY.prototype.insert = function( tablename, data )
{
	try{
		let sql = insertSQL( tablename, data );
	    return this.query( sql );
	}
	catch( e )
	{
		return Promise.reject( e );
	}
};

//多条数据的插入
YY.prototype.inserts = function( tablename, data )
{
	try{
		let sql = insertsSQL( tablename, data );
		return this.query( sql );
	}
	catch( e )
	{
		return Promise.reject( e );
	}
};

// 更新
YY.prototype.update = function( tablename, data, where )
{
	if( lele.empty( data ) )
	{
		return Promise.reject( 'update-data isNot exsit' );
	}
	try{
		let sql = updateSQL( tablename, data, where );
		return this.query( sql );
	}
	catch( e )
	{
		return Promise.reject( e );
	}
};

//删除
YY.prototype.delete = function( tablename, where ) {
	if( lele.empty( where ) )
	{
		return Promise.reject( 'delete-where isNot exsit' );
	}
	try{
		let sql = deleteSQL( tablename, where );
		return this.query( sql );
	}
	catch( e )
	{
		return Promise.reject( e );
	}
};

//查询
YY.prototype.select = function( tablename, where, row='*' ) {
	try{
		if( lele.empty( where ) )
		{
			let sql = 'select * from ' + tablename;
			return this.query( sql );
		}
		let sql = selectSQL( tablename, where, row );
		return this.query( sql );
	}
	catch( e )
	{
		return Promise.reject( e );
	}
};

//事务
YY.prototype.startTransaction = function( callback )
{
    var that = this;
    return new Promise( function( resolve, reject )
    {
        that.pool.getConnection( function( err, con )
        {
            if( err )
            {
                reject( err );
                return;
            }
            var rescon = {
                'beginTransaction' : function( cb )
                {
                    con.beginTransaction( cb );
                },
                'end': function() {
                    con.release();
                },
                'rollback': function() {
                    con.rollback(function( err ){
                        if( err ) {
                            logger.error( '[function-startTransaction-rollback : ]', err );
                        }
                    });
                    con.release();
                },
                'commit': function( ) {
                    return new Promise( function( resolve, reject )
                    {
                        con.commit( function( err )
                        {
                            if( err )
                            {
                                reject( err );
                                return;
                            }
                            resolve( 'success' );
                        });
                    });
                },
                'insert': function( tablename, data ) {
                    let sql = insertSQL( tablename, data );
                    return this.query( sql );
                },
                'inserts': function( tablename, data ) {
                    let sql = insertsSQL( tablename, data );
                    return this.query( sql );
                },
                'update': function( tablename, data, where ) {
                    let sql = updateSQL( tablename, data, where );
                    return this.query( sql );
                },
                'delete': function( tablename, where ) {
                    let sql = deleteSQL( tablename, where );
                    return this.query( sql );
                },
                'select': function( tablename, where, row ='*' ) {
                    if( lele.empty( where ) )
                    {
                        let sql = 'select * from ' + tablename;
                        return this.query( sql );
                    }
                    let sql = selectSQL( tablename, where, row );
                    return this.query( sql );
                },
                'query': function( sql ) {
                    return new Promise( function( resolve, reject )
                    {
                        con.query( sql, function( err, results )
                        {
                            if( err )
                            {
                                reject( err );
                                return;
                            }
                            resolve( results );
                        });
                    });
                },
            };
            resolve( rescon );
        });
    });
};
//事务
YY.prototype.startTransaction1 = function( callback )
{
    this.pool.getConnection( function( err, con )
    {
        if( err )
        {
        	logger.error( '[function-startTransaction : ]', err );
        	return callback( err, null );
        }
        var rescon = {
        	'beginTransaction' : function( cb )
        	{
        		con.beginTransaction( cb );
        	},
        	'end': function() {
                con.release();
            },
            'rollback': function() {
                con.rollback(function( err ){
                    if( err ) {
                        logger.error( '[function-startTransaction-rollback : ]', err );
                    }
                });
                con.release();
            },
            'commit': function( ) {
            	return new Promise( function( resolve, reject )
        		{
        			con.commit( function( err )
    				{
    					if( err )
    					{
    						reject( err );
    						return;
    					}
    					resolve( 'success' );
    				});
        		});
            },
            'insert': function( tablename, data ) {
            	let sql = insertSQL( tablename, data );
	    		return this.query( sql );
            },
            'inserts': function( tablename, data ) {
                let sql = insertsSQL( tablename, data );
                return this.query( sql );
            },
            'update': function( tablename, data, where ) {
                let sql = updateSQL( tablename, data, where );
                return this.query( sql );
            },
            'delete': function( tablename, where ) {
                let sql = deleteSQL( tablename, where );
				return this.query( sql );
            },
            'select': function( tablename, where, row ='*' ) {
                if( lele.empty( where ) )
				{
					let sql = 'select * from ' + tablename;
					return this.query( sql );
				}
				let sql = selectSQL( tablename, where, row );
				return this.query( sql );
            },
            'query': function( sql ) {
            	return new Promise( function( resolve, reject )
        		{
        			con.query( sql, function( err, results )
        			{
        				if( err )
        				{
        					reject( err );
        					return;
        				}
        				resolve( results );
	                });
        		});
            },
        };
        callback( null, rescon );
    });
};

// //------normal 方法 start
var insertSQL = function( tablename, data ) {
    var tname = [];
    var tval = [];
    for( var key in data ) {
        tname.push( key );
        tval.push( "'" + data[key] + "'" );
    }
    return 'INSERT INTO ' + tablename + ' (' + tname.join( ',' ) + ') VALUES (' + tval.join( ',' ) + ')';
};

var insertsSQL = function( tablename, data )
{
    if( data.constructor != Array ) data = [ data ];

    let tname = [];
    let tval = [];
    for( let i = 0; i < data.length; i ++ ) 
    {
        let tmp = [];
        for( let key in data[ i ] ) 
        {
            if( i === 0 ) tname.push( key );
            
            tmp.push( "'" + data[ i ][ key ] + "'" );
        }
        tval.push( '(' + tmp.join( ',' ) + ')' );
    }
    return 'INSERT INTO ' + tablename + ' (' + tname.join( ',' ) + ') VALUES ' + tval.join( ',' );
};

var updateSQL = function( tablename, data, where ) {
    var setdata = [];
    for( var key in data ) 
    {
        if( typeof data[ key ] != 'function' ) 
        {
            //特殊处理与这种sql:  set key = key + 1
            if( typeof data[ key ] === 'string' && data[ key ].indexOf( key ) === 0 ) 
            {
                setdata.push( key + ' = ' + data[ key ] );
                continue;
            }
            setdata.push( key +" = '" + data[ key ] + "'" );
        }
    }
    return 'UPDATE ' + tablename + ' SET ' + setdata.join(',') + ' WHERE ' + where + ';';
};

var deleteSQL = function( tablename, where ) {
    return 'DELETE FROM '+ tablename +' WHERE '+ where +';';
};

var selectSQL = function( tablename, where, row ) {
    return 'SELECT ' + row + ' FROM ' + tablename + ' WHERE ' + where + ';';
};
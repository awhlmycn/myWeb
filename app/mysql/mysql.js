var mysql = require( 'mysql' );
var async = require( 'async' );
// var logger = require( __dirname +'/../tool/log4.js').getLogger( 'log_dao' );

//type  'logic' | 'log'
var YY = function( limit, data_name, mysqlConfig ) {
    this.pool = null;
    this.init( limit, data_name, mysqlConfig );
};

module.exports = YY;

//------normal 方法 start
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

    var tname = [];
    var tval = [];
    var i = 0;
    var key = '';
    var tmp = [];
    for( i = 0; i < data.length; i ++ ) 
    {
        tmp = [];
        for( key in data[ i ] ) 
        {
            if( i === 0 ) tname.push( key );
            
            tmp.push( "'" + data[ i ][ key ] + "'" );
        }
        tval.push( '(' + tmp.join( ',' ) + ')' );
    }
    i = key = tmp = null;
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
};//------normal 方法 end

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
YY.prototype.query = function( sql, args ) {
    
    if( !sql )
    {
        args( { 'error': 'no sql' + sql }, null );
        return;
    }
    this.pool.getConnection(function( err, connection ) {

        if( err ) {
            args( err, null );
            return;
        }
        connection.query( sql, function( err, res ) {
            if( err ) console.log( 'err-sql='+ sql );
            args( err, res );
            connection.release();
        });
    });
};

//插入数据
YY.prototype.insert = function( tablename, data, args ) {
    if( typeof data === 'function' ) {
        this.query( tablename, data );
        return;
    }
    var sql = insertSQL( tablename, data );
    this.query( sql, function( err, res ) {
        if( !err && res[ 'affectedRows' ] == 0 ) {
            err = { 'err' : 'insert响应条数为0' };
        }
        args( err, res );
    });
};

//插入数据
YY.prototype.inserts = function( tablename, data, args ) {
    if( typeof data === 'function' ) {
        this.query( tablename, data );
        return;
    }
    var sql = insertsSQL( tablename, data );
    this.query( sql, function( err, res ) {
        if( !err && res[ 'affectedRows' ] == 0 ) {
            err = { 'err' : 'insert响应条数为0' };
        }
        args( err, res );
    });
};

//更新
YY.prototype.update = function( tablename, data, where, args ) {
    if( typeof data === 'function' ) {
        this.query( tablename, data );
        return;
    }
    var sql = updateSQL( tablename, data, where );
    this.query( sql ,function ( err, res) {
        if( !err && res[ 'affectedRows' ] == 0 ) {
            err = 'update响应条数为0';
        }
        args( err, res );
    });
};

//删除
YY.prototype.delete = function( tablename, where, args ) {
    if( typeof where === 'function' ) {
        this.query( tablename, where );
        return;
    }
    var sql = deleteSQL( tablename, where );
    this.query( sql, function( err, res ) {
        args( err, res );
    });
};

//查询
YY.prototype.select = function( tablename, where, row, args ) {
    if( typeof where === 'function' ) {
        this.query( tablename, where );
        return;
    }
    if( typeof row === 'function' ) {
        args = row;
        row = '*';
    }
    var sql = selectSQL( tablename, where, row );
    this.query( sql, function( err, res ) {
        args( err, res );
    });
};

//事务
YY.prototype.startTransaction = function( callback ) {
    this.pool.getConnection(function( err, con ) {
        if( err ) {
            logger.error( 'function-startTransaction : ', err );
        }
        var rescon = {
            'end': function() {
                con.release();
            },
            'rollback': function() {
                con.rollback(function( err ){
                    if( err ) {
                        logger.error( 'function-startTransaction-rollback : ', err );
                    }
                });
                con.release();
            },
            'commit': function( args ) {
                con.commit( function( err ) {
                    if( err ) {
                        args( err );
                    }
                    else {
                        args( null );
                        con.release();
                    }
                });
            },
            'insert': function( tablename, data, args ) {
                if( typeof data === 'function' ) {
                    this.query( tablename, data );
                    return;
                }
                var sql = insertSQL( tablename, data );
                this.query( sql, function( err, res ) {
                    if( !err && res['affectedRows'] == 0 ) {
                        err = {'err':'insert响应条数为0'}
                    }
                    args( err, res );
                });
            },
            'inserts': function( tablename, data, args ) {
                if( typeof data === 'function' ) {
                    this.query( tablename, data );
                    return;
                }
                var sql = insertsSQL( tablename, data );
                this.query( sql, function( err, res ) {
                    if( !err && res['affectedRows'] == 0 ) {
                        err = {'err':'insert响应条数为0'}
                        console.log( 'sql err inserts=' + sql );
                    }
                    args( err, res );
                });
            },
            'update': function( tablename, data, where, args ) {
                if( typeof data === 'function' ) {
                    this.query( tablename, data );
                    return;
                }
                var sql = updateSQL( tablename, data, where );
                this.query( sql, function( err, res ) {
                    if( !err && res['affectedRows'] == 0 ) {
                        err = 'update响应条数为0';
                    }
                    args( err, res );
                });
            },
            'delete': function( tablename, where, args ) {
                if( typeof where === 'function' ) {
                    this.query( tablename, where );
                    return;
                }
                var sql = deleteSQL( tablename, where );
                this.query(sql, function( err, res ) {
                    if( !err && res['affectedRows'] == 0 ) {
                        err = { 'err' : 'delete响应条数为0' };
                    }
                    args(err,res);
                });
            },
            'select': function( tablename, where, row, args ) {
                if( typeof where === 'function' ) {
                    this.query( tablename, where );
                    return;
                }
                if( typeof row === 'function' ) {
                    args = row;
                    row = '*';
                }
                var sql = selectSQL( tablename, where, row );
                this.query( sql, args );
            },
            'query': function( sql, args ) {
                con.query( sql, function( err, results ) {
                    args( err, results );
                });
            },
            'waterfall': function( func_array, cb ) {
                func_array.unshift(
                    function( cb ) {
                        con.beginTransaction( function( err ) {
                            if( err ) {
                                cb( err );
                                return;
                            }
                            cb( null );
                        });
                    }
                );
                async.waterfall( func_array, cb );
            }
        };
        callback( rescon );
    });
};
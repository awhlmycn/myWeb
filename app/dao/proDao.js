"use strict";
var lele = require( '../tool/lele.js');
var dbLogic = global.dbPro;
var runDao = module.exports;

/**
 * 使用sql获取数据
 */
runDao.query = function( sql )
{
    if( lele.empty( sql  ) )
    {
        return Promise.resolve( [] );
    }
    return dbLogic.query( sql );
};

/**
 * 基本方法select
 * @param   table   表名
 * @param   where   条件( role_id=1 )
 * @param   row     字段(role_id,name )
 * @param   promise对象
 */
runDao.select = function( table, where, row='*' )
{
    if( lele.empty( table  ) )
    {
        return Promise.resolve( [] );
    }
    return dbLogic.select( table, where, row );
};

/**
 * 基本方法insert(单条数据插入)
 * @param   table   表名
 * @param   data    插入数据 { 'role_id':1, 'name':'xxx' }
 * @param   promise对象
 */
runDao.insert = function( table, data )
{
    if( lele.empty( table ) || lele.empty( data ) )
    {
        return Promise.resolve( [] );
    }
    return dbLogic.insert( table, data );
};

/**
 * 基本方法insert(多条数据插入)
 * @param   table   表名
 * @param   data    插入数据 [ { 'role_id':1, 'name':'xxx' }, { 'role_id':2, 'name':'xxx2' } ]或者{ 'role_id':1, 'name':'xxx' }
 * @param   cb      回调
 */
runDao.inserts = function( table, data, cb )
{
    if( lele.empty( table ) || lele.empty( data ) )
    {
        return Promise.resolve( [] );
    }
    return dbLogic.inserts( table, data );
};

/**
 * 基本方法update(单条数据插入)
 * @param   table   表名
 * @param   data    更新数据 { 'role_id':1, 'name':'xxx' }
 * @param   where   条件
 * @param   promise对象
 */
runDao.update = function( table, data, where )
{
    if( lele.empty( table ) || lele.empty( data ) )
    {
        return Promise.resolve( [] );
    }
    return dbLogic.update( table, data, where );
};

/**
 * 基本方法delete(删除数据)
 * @param   table   表名
 * @param   where   条件
 * @param   promise对象
 */
runDao.delete = function( table, where )
{
    if( lele.empty( table ) )
    {
        return Promise.resolve( [] );
    }
    return dbLogic.delete( table, where );
};

/**
 * 事务操作
 * @param   callback    方法function( con ){}
 */
runDao.transaction = function( callback )
{
    dbLogic.startTransaction( callback );
};

/*
    runDao.startTransaction( function( err, con )
    {
        if( err )
        {
            res.json( { err : err });
            return;
        } 
        con.beginTransaction111( async function( err )
        {
            if( err )
            {
                con.end();
                return;
            }
            try
            {
                var ruslt = await con.update( 'user', { 'gold' : 'gold-' + 100 },'id=2' );
                await( con.update( 'user', { 'gold' : 'gold+'+100},'id=1' ) ) ;
                await con.commit();
                con.end();
            }
            catch( e )
            {
                con.rollback();
            }
            res.json( {'ok':'ok'} );
        });
    });



    router.get( '/ceshi', async function( req, res )
{
    try{
        var con = await global.dbPro.startTransaction();
        con.beginTransaction( async function( err )
        {
            if( err )
            {
                con.end();
                return;
            }
            try
            {
                var ruslt = await con.update( 'user', { 'gold' : 'gold-' + 10 },'id=2' );
                await con.update( 'user', { 'gold' : 'gold+'+10},'id=1' );
                await con.commit();
                con.end();
                res.json( {'ok':'ok'} );
            }
            catch( e )
            {
                res.json( {'ok':e.toString()} );
                con.rollback();
            }
        });
    }
    catch( e )
    {
        res.json( { 'err' : e.toString() });
    }
});
*/

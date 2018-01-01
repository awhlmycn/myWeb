"use strict";
var lele = require( '../tool/lele.js');
var dbLogic = global.db;
var runDao = module.exports;

/**
 * 使用sql获取数据
 */
runDao.query = function( sql, cb )
{
    if( lele.empty( sql  ) )
    {
        cb( null, [] );
        return;
    }
    dbLogic.query( sql, cb );
};

/**
 * 基本方法select
 * @param   table   表名
 * @param   where   条件( role_id=1 )
 * @param   row     字段(role_id,name )
 * @param   cb      回调
 */
runDao.select = function( table, where, row, cb )
{
    if( lele.empty( table ) )
    {
        cb( null, [] );
        return;
    }
    dbLogic.select( table, where, row, cb );
};

/**
 * 基本方法insert(单条数据插入)
 * @param   table   表名
 * @param   data    插入数据 { 'role_id':1, 'name':'xxx' }
 * @param   cb      回调
 */
runDao.insert = function( table, data, cb )
{
    if( lele.empty( table ) || lele.empty( data ) )
    {
        cb( null, [] );
        return;
    }
    dbLogic.insert( table, data, cb );
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
        cb( null, [] );
        return;
    }
    dbLogic.inserts( table, data, cb );
};

/**
 * 基本方法update(单条数据插入)
 * @param   table   表名
 * @param   data    更新数据 { 'role_id':1, 'name':'xxx' }
 * @param   where   条件
 * @param   cb      回调
 */
runDao.update = function( table, data, where, cb )
{
    if( lele.empty( table ) || lele.empty( data ) )
    {
        cb( null, [] );
        return;
    }
    dbLogic.update( table, data, where, cb );
};

/**
 * 基本方法delete(删除数据)
 * @param   table   表名
 * @param   where   条件
 * @param   cb      回调
 */
runDao.delete = function( table, where, cb )
{
    if( lele.empty( table ) )
    {
        cb( null, [] );
        return;
    }
    dbLogic.delete( table, where, cb );
};

/**
 * 事务操作
 * @param   callback    方法function( con ){}
 */
runDao.transaction = function( callback )
{
    dbLogic.startTransaction( callback );
};

/**
 * tlog保存
 * @param   table   表名
 * @param   data    插入数据 [ { 'role_id':1, 'name':'xxx' }, { 'role_id':2, 'name':'xxx2' } ]或者{ 'role_id':1, 'name':'xxx' }
 */
runDao.tlogInsert = function ( table, data, cb ) 
{
    dbLogic.inserts( table, data, cb );
};

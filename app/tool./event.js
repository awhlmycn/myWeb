const events = require('events');
const EventEmitter = events.EventEmitter;
const util = require( 'util');
//事件通信模块
function myEmiter()
{
    EventEmitter.call( this );
};
util.inherits( myEmiter, EventEmitter );//继承EventEmitter类
const myEmitterIns = new myEmiter();
module.exports = myEmitterIns;

myEmitterIns.on( 'news', function( data )
{
    console.log("data",data);
    myEmitterIns.emit( 'do',{ data : 'i am ok'});
    console.log( 'i shou dao new news ');
});

myEmitterIns.on( 'do', function( data )
{
    console.log( "1111", data );

});
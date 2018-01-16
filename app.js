const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const start = require( './app/tool/start.js' );
const app = express();

// view engine setup
app.set('views', path.join(__dirname, './app/views'));
app.engine( '.html', require('ejs').__express);
app.set('view engine', 'html');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './app/public')));

// 跨域问题
app.all( '*', function( req, res, next )
{
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1');
    // if( req.method == 'OPTIONS' ) 
    // {
    //     res.sendStatus( 200 );
    // }
    // else next();
    	res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token,X-Requested-With");
        res.setHeader("Access-Control-Expose-Headers", "*");

        if( req.method == 'OPTIONS' ) 
	    {
	        res.sendStatus( 200 );
	    }
	    else next();
});

start.run( app );


// catch 404 and forward to error handler
app.use( function( req, res, next )
{
  	let err = new Error( 'Not Found' );
  	err.status = 404;
  	next( err );
});

// error handler
app.use( function( err, req, res, next )
{
  	// set locals, only providing error in development
  	res.locals.message = err.message;
  	res.locals.error = req.app.get('env') === 'development' ? err : {};

  	// render the error page
  	res.status( err.status || 500 );
  	res.render( 'error' );
});

module.exports = app;

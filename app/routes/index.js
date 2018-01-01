const express = require('express');
let router = express.Router();
const runDao = require('../dao/proDao.js');
const lele = require( '../tool/lele.js')
module.exports = router;

/*
	1.用户登陆
	post请求
	{ "UserInfo": { "userid": userid, "password": password } }
 */
router.all( '/UserLogin', async function( req, res )
{
	var data = lele.empty( req.query )? req.body:req.query;
	var data = {
		UserInfo:{
			userid : '18905715566',
			password : '76c52202fc98c8f8ab89140d051d8344'
		}
	};
	var UserInfo = data.UserInfo;
	if( lele.empty( UserInfo ) || lele.empty( UserInfo.userid ) || lele.empty( UserInfo.password ))
	{
		res.json( { status : 0, result : '数据有误' });
		return;
	}
	try{
		var bsSQL = "select userid,username,password,mobile,sex,email,birthday,Status FROM oss_users where userid='" + UserInfo.userid + "'";
		let tmpUserInfo = await runDao.query( bsSQL );
		if( tmpUserInfo.length == 0 )
		{
			res.json({ status: 3, "result": "用户不存在!" } );
			return;	
		}
		var userinfo = tmpUserInfo[0];
		if( userinfo.password != UserInfo.password )
		{
			res.json( { status : 2, result : '用户口令错误' } );
			return;
		}
		bsSQL = 'select roleid from oss_users where userid="' + UserInfo.userid + '"';
		let _UserRole = await runDao.query( bsSQL );
		if( _UserRole.length == 0 )
		{
			res.json({ status: 1, "result": "用户没有任何权限!" } );
			return;
		}
		var result = _UserRole[0];


		let _UserInfo = 

		res.json( _UserRole );
	}
	catch( err )
	{
		res.json( { status : 0, result : err });
	}
});



// router.get( '/ceshi', async function( req, res )
// {
// 	var UserInfo = {
// 		userid : '18905715566',
// 		password : '76c52202fc98c8f8ab89140d051d8344'
// 	};
//     var _UserRole = { Result: 0 };
//     var _UserInfo = { Result: 0 };
//     var bsSQL = "select distinct a.userid,a.status,b.roleid,a.password from oss_users a,oss_roleuser b where a.userid = b.userid and a.userid='" + UserInfo.userid + "'";
//     var result = await runDao.query( bsSQL );

//     bsSQL = "SELECT userid,username,password,mobile,sex,email,birthday,Status FROM oss_users where userid='" + UserInfo.userid + "'";
//     var userinfo = await runDao.query( bsSQL );
//     if( userinfo.length == 0 )
//     {
//     	res.json( { status : 3, result : '用户不存在！'});
//     	return;
//     }
//     if( userinfo[0].password != UserInfo.password )
//     {
//     	res.json( { status : 2, result : '用户口令错误'});
//     	return;
//     }
//     if( result.length == 0 )
//     {
//     	res.json( { status : 1, result : '用户没有任何权限！'});
//     	return;
//     }
//     var _userroleid = '';
//     var _rolename = '';
//     if( result.length == 0 && userinfo[0].Status == 3 )
//     {
//         _userroleid = '999999'; ///Guest用户
//     }
//     else
//     {
//         _userroleid = result[0].roleid;
//     }
//     var UserInfo = {};
//     var _userinfo = {};
//     var _roleinfo = {};
//     var _desktopinfo = {};
//     var _notifyinfo = {};
//     var _rolelist = {};


                    
                    
                    
//                     var bsSQL = "select * from oss_users where userid='" + UserInfo.userid + "'";
//                     ps.push(ExecuteSyncSQLResult(bsSQL, _userinfo));

//                     // var bsSQL = "select a.roleid,b.rolename from oss_roleuser a, oss_roles b where a.roleid = b.roleid and userid='" + UserInfo.userid + "'";
//                     var bsSQL = '';
//                     if (_userroleid == '999999') {
//                         bsSQL = "select roleid,rolename from  oss_roles  where roleid='" + _userroleid + "'";
//                     } else {
//                         bsSQL = "select a.roleid,b.rolename from oss_roleuser a, oss_roles b where a.roleid = b.roleid and userid='" + UserInfo.userid + "'";
//                     }
//                     ps.push(ExecuteSyncSQLResult(bsSQL, _rolelist));

//                     bsSQL = "select moduleid,modulename,url from oss_modules where moduleid in (select moduleid from oss_roledetail where roleid like '" + _userroleid + "%') or isdefault = 1;";
//                     ps.push(ExecuteSyncSQLResult(bsSQL, _roleinfo));

//                     bsSQL = "select a.userid,a.moduleid,a.modulestyle,b.url from oss_userdesktop a,oss_modules b where a.moduleid = b.moduleid and a.userid =  '" + UserInfo.userid + "';";
//                     ps.push(ExecuteSyncSQLResult(bsSQL, _desktopinfo));

//                     Promise.all(ps).then(function() {
//                         var UserInfo = {};
//                         UserInfo.userinfo = _userinfo.Result[0];
//                         UserInfo.userinfo.applyroleid = _rolelist.Result[0].roleid;

//                         UserInfo.userinfo.rolename = "";
//                         _rolelist.Result.forEach(function(item) {
//                             UserInfo.userinfo.rolename += item.rolename + " ";
//                         });


//                         var modulelist = [];
//                         _roleinfo.Result.forEach(function(item) {
//                             var finditem = _.find(_desktopinfo.Result, function(_detail) {
//                                 return _detail.moduleid == item.moduleid;
//                             });
//                             if (finditem) {
//                                 item.atDesktop = 1;
//                             } else {
//                                 item.atDesktop = 0;
//                             }
//                             modulelist.push(item);
//                         });

//                         UserInfo.userrole = modulelist;
//                         UserInfo.userdesktop = _desktopinfo.Result;
//                         UserInfo.rolelist = _rolelist.Result;

//                         cb(null, {
//                             status: 1,
//                             "result": UserInfo
//                         });
//                         EWTRACE("UserLogin End");
//                     }, function(err) {
//                         cb(err, {
//                             status: 0,
//                             "result": ""
//                         });
//                         EWTRACEIFY(err);
//                         EWTRACE("UserLogin End");
//                     });
//                 }
//             }
//         }, function(err) {
//             cb(err, {
//                 status: 0,
//                 "result": ""
//             });
//             EWTRACEIFY(err);
//             EWTRACE("UserLogin End");
//         });

//     }
// });




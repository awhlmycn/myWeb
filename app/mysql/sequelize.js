// const seqelizeDao = module.exports;
const Sequelize = require( 'sequelize' );
var options = {
	database : 'cce_crm',
	username : 'root',
	password : 'Admin888@2018',
	host : '127.0.0.1'
};
// const sequelize = new Sequelize( options.database, options.username, options.password, {
const sequelize = new Sequelize( options.database, options.username, options.password, {
	// host : options.host,
	dialect : 'mysql',
	pool : {
		max : 5,
		min :0,
		acquire : 30000,
		idle : 10000
	},
	//设置主从关系
	// replication : {
	// 	read : [
	// 		{ host : options.host, username : options.username, password : options.password }
	// 	],
	// 	write :{ host : options.host, username : options.username, password : options.password }
	// },
	define : {
		//去除creatAt,updateAt ： 默认的时间,或者是再每个model中定义
		// timestamps: false,
		//数据库别名
		freezeTableName : false,
		//编码
		charset : 'utf8'
	},
	//去除log数据
	// logging : true, 
	//操作别名
	operatorsAliases : false
});

//1.test connection
// sequelize.authenticate().then( () => {
// 	console.log( 'connect has connected !');
// })
// .catch( err => {
// 	console.log( 'unable : ' + err );
// })
//url的链接
// const sequelize = new Sequelize( 'mysql://root:');
//定义一个model
const Account = sequelize.define( 'account', {
	accountId :{
		type : Sequelize.INTEGER
	},
	account : {
		type : Sequelize.STRING
	}
},{ tableName: 'account', freezeTableName:false});

const Projects = sequelize.define( 'projects', {
	accountId : {
		type : Sequelize.INTEGER
	},
	name : {
		type : Sequelize.STRING
	},
	age : {
		type : Sequelize.INTEGER
	}
},{
	timestamps : false
});

Account.hasOne( Projects );

// Account.findAndCountAll({
// 	raw :true,
// 	type : 'select',
//   offset: 0,
//   limit: 3,
//   include:[ Projects]
// }).then( user=>{
//     console.log(user);
// });

Account.findAll({
  attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'no_id']],
  raw : true,
}).then( info => {
	console.log( info );
});
//3.force : 如果表存在则强制的删除,然后再创建
// Account.sync( {force : true }).then( () => {
// 	return Account.create({
// 		accountId : 1,
// 		account : 'lmy111'
// 	});
// });


//2.查询
// Account.findAll().then( users => {
// 	console.log( users );
// });

//3.查找一个
// Account.findOne().then( user => {
// 	//use
// 	console.log( 'data->>' + user.get( 'account') );
// 	console.log( 'findOne-->' + user );
// });

//4.执行query
// sequelize.query( 'select * from accounts where id=:id', 
// 	{ 
// 		raw : true,
// 		type : 'SELECT',
// 		model: Account ,
// 		replacements : { id : 1 }
// }).then( users => {
// 	console.log( users );
// });

/**
 * model的属性
 *  {
 *  //类型
 *  	type : Sequelize.BOOLEAN
 *  	//是否允许为空
 *  	allowNull : false,
 *  	//默认值
 *  	defaultValue : true,
 *  	//是否唯一值
 *  	unique :  true,
 *  	//是否密钥
 *  	primaryKey : true,
 *   	//是否自动增长
 *   	autoIncrement : true,
 *   	//索引
 *   	indexes :[{ fields: []}]
 *  }
 */
// Account.findById(1).then( user =>{
// 	console.log( user );
// });
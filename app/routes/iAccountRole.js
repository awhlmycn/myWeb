const express = require( 'express' );
let router = express.Router();
const runDao = require('../dao/proDao.js');
const lele = require( '../tool/lele.js');
const validate = require( 'validate.js' );
module.exports = router;

/**
 * 1.获取角色列表
 */
router.all( '/roleList', async function( req, res )
{
	var result = await runDao.select( 'account_role', 'status=1', 'level_id,level_name,`keys`,id');
	res.json( result );
});
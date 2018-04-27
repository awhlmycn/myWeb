const fs = require('fs');
const jwt = require('jsonwebtoken');
const cert = fs.readFileSync( './app/cert/jwt_rsa_private_key.pem', 'utf-8' );
const pubcert = fs.readFileSync('./app/cert/jwt_rsa_public_key.pem');

let jwtJson = module.exports;

/**
 * 1加密token
 */
jwtJson.encode = function( payload )
{
    return new Promise((resolve, reject) => {
        jwt.sign( payload, cert, { algorithm: 'RS256', expiresIn: '7d' }, function( err, token )
        {
            if( err )
            {
                reject( err );
                return;
            }
            resolve( token );
        } );
    });
};
/**
 * 2.解密token
 */
jwtJson.decode = function( token )
{
    return new Promise((resolve, reject) => {
        jwt.verify( token, pubcert, { algorithms: ['RS256'], expiresIn: '7d' }, function ( err, payload )
        {
            if( err )
            {
                reject( err );
                return
            }
            resolve( payload );
        });
    });
};
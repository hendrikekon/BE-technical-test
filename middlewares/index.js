const { getToken, } = require('../utils');
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/Users/model');
// const { subject } = require('@casl/ability');

function decodeToken() {
    return async function (req, res, next) {
        try {
            let token = getToken(req);

            if (!token) return next();
            
            req.user = jwt.verify(token, config.secretkey);
            let user = await User.findOne({token: {$in: [token] } });

            if (!user){
                res.json({
                    error: 1,
                    message: 'Token expired'
                })
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.json({
                    error: 1,
                    message: 'Token expired'
                });
            } else if (err.name === 'JsonWebTokenError') {
                return res.json({
                    error: 1,
                    message: 'Invalid token'
                });
            }
            return next(err);
        }
        return next();
    }
}



module.exports = {
    decodeToken
}
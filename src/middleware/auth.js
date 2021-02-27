const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');
const { bad } = require('../helpers/response');


/**
 * @typedef AuthOptions
 * @property {string|string[]} [roles] 
 */
//

/**
 * @returns {string}
 */
const getAuthorization = req => req.header('Authorization').replace('Bearer ', '');

/**
 * @param {string} token
 */
const verifyAuthorization = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};

/**
 * @todo Check redis cache for auth token
 * @type {import('express').RequestHandler}
 */
async function standard(req, res, next) {
    try {
        const token = getAuthorization(req);
        const user = await verifyAuthorization(token);
        if (!user) throw new Error('Invalid');
        req.user = user; // await User.findOne({ _id: user.uid });
        return next();
    } catch (e) {
        const payload = bad(401, 'Unauthorized');
        res.status(401).json(payload);
    }
}

/**
 * @todo Implement role based authentication for roles (admin, customer rep)
 * @param {AuthOptions} options
 * @returns {import('express').RequestHandler}
 */
function custom(options) {
    return standard;// (req, res, next) => {};
}

/**
 * attach to route if you want to validate the user
 * @param {AuthOptions} [options]
 * @returns {import('express').RequestHandler}
 */
function auth(options) {
    return options ? custom(options) : standard;
}

auth.standard = standard;
auth.custom = custom;

module.exports = auth;

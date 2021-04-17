// const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { bad } = require('../helpers/response');


/**
 * @typedef AuthOptions
 * @property {string|string[]} [role]
 * @property {string|string[]} [action] 
 */
//

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

const extractUser = async req => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const user = await verifyAuthorization(token);
    if (user) return user;
    throw new Error('Invalid');
};

/**
 * @todo Check redis cache for auth token
 * @type {import('express').RequestHandler}
 */
async function standard(req, res, next) {
    try {
        const user = await extractUser(req);
        req.user = user;
        return next();
    } catch (e) {
        const payload = bad(401, 'Unauthorized');
        res.json(payload);
    }
}

/**
 * @todo Implement role based authentication for roles (admin, customer rep)
 * @param {AuthOptions} options
 * @returns {import('express').RequestHandler}
 */
function custom(options) {
    if (!options || typeof options !== 'object') {
        return standard;
    }

    return async (req, res, next) => {
        try {
            const user = await extractUser(req);
            for (let i in options) {
                let opt = options[i];
                let val = user[i];
                if (Array.isArray(opt)) {
                    if (!opt.includes(val)) {
                        throw new Error(opt);
                    }
                } else if (val !== opt) {
                    throw new Error(opt);
                }
            }
            req.user = user;
            return next();
        } catch (e) {
            const payload = bad(401, `Unauthorized: ${e}`);
            res.json(payload);
        }
    };
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
auth.verifyAuthorization = verifyAuthorization;

module.exports = auth;

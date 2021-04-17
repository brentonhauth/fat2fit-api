const env = process.env.NODE_ENV || 'dev';

/**
 * @typedef AppConfig
 * @property {number} PORT
 * @property {"prod"|"dev"|string} ENV
 * @property {string} DB_URL
 * @property {string} REDIS_URL
 * @property {string} JWT_SECRET
 * @property {string} COOKIE_NAME
 * @property {string} [REDIS_PASSWORD]
 */

/** @type {AppConfig} */
let config;

try {
    config = require(`./env/${env}`);
    config.ENV = env;
} catch (e) {
    config = require('./env/dev');
    config.ENV = 'dev';
}

config.COOKIE_NAME = 'sess';

module.exports = config;

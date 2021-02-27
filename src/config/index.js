const env = process.env.NODE_ENV || 'dev';

/**
 * @typedef AppConfig
 * @property {number} PORT
 * @property {"prod"|"dev"|string} ENV
 * @property {string} DB_URL
 * @property {string} REDIS_URL
 * @property {string} JWT_SECRET
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

module.exports = config;

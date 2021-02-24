const env = process.env.NODE_ENV || 'dev';

let config;

try {
    config = require(`./env/${env}`);
    config.ENV = env;
} catch (e) {
    config = require('./env/dev');
    config.ENV = 'dev';
}

module.exports = config;

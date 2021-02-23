const helmet = require('helmet');
const { urlencoded, json } = require('body-parser');

/**
 * Appends common middleware to a router or app
 * @param {import('express').Application} app 
 */
module.exports = app => {
    app.use(helmet());
    app.use(urlencoded({ extended: false }));
    app.use(json());
    return app;
};

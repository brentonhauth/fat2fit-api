const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('../config');
const { urlencoded, json } = require('body-parser');

/**
 * @param {express.Application} app
 */
function development(app) {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

/**
 * Appends common middleware to a router or app
 * @param {express.Application} app 
 */
module.exports = app => {
    if (/^dev/.test(config.ENV)) {
        development(app);
    }
    app.use(helmet());
    app.use(cors({
        allowedHeaders: ['Origin', 'Authorization', 'Content-Type'],
        origin: '*'
    }));
    app.use(express.static('./public'));
    app.use(urlencoded({ extended: false }));
    app.use(json());
    return app;
};

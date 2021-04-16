const express = require('express');
const helmet = require('helmet');
const config = require('../config');
const cors = require('cors');

const webCors = cors({
    allowedHeaders: ['Origin', 'Authorization', 'Content-Type'],
    origin: [
        /^http:\/\/localhost(\:\d+)?\/?$/,
        /^https?:\/\/brentonhauth.github.io\/?/
    ]
});

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
    app.use((req, res, next) => {
        if (req.query.web) {
            return webCors(req, res, next);
        } else {
            return next();
        }
    });
    app.use(express.static('./public'));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    return app;
};

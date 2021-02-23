const express = require('express');
const helmet = require('helmet');
const { urlencoded, json } = require('body-parser');

/**
 * Appends common middleware to a router or app
 * @param {express.Application} app 
 */
module.exports = app => {
    app.use(express.static('./public'));
    app.use(helmet());
    app.use(urlencoded({ extended: false }));
    app.use(json());
    return app;
};

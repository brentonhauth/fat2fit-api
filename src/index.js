const db = require('./services/mongo')();
const express = require('express');
const attachCommon = require('./middleware/common');
const attachErrorHandlers = require('./middleware/errors');

const account = require('./api/account');
const group = require('./api/group');

module.exports = () => {
    const app = attachCommon(express());

    app.use('/account', account);
    app.use('/group', group);
    
    return attachErrorHandlers(app);
};

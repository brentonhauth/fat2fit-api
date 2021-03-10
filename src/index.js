const express = require('express');
const attachCommon = require('./middleware/common');
const attachErrorHandlers = require('./middleware/errors');

const account = require('./api/account');
const group = require('./api/group');
const admin = require('./api/admin');

module.exports = () => {
    const app = attachCommon(express());

    app.use('/account', account);
    app.use('/group', group);
    app.use('/admin', admin);
    
    return attachErrorHandlers(app);
};

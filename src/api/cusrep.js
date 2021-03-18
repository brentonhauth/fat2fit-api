const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const Activity = require('../models/activity');
const UserRole = require('../config/userRole');

const router = express();

router.use(auth({ role: UserRole.CUSTOMER_REP }));

router.get('/', (req, res, next) => {
    return next(new Error('Not yet implemented'));
});

module.exports = router;

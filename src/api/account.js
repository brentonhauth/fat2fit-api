const express = require('express').Router;
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express();


// NOTE: All routes in this file are automatically appended to '/account/*'

router.get('/info', auth(), (req, res) => {
    // getting account info
    res.json({});
});

// path=/account/login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    User.findByEmailAndPassword(email, password).then(async user => {
        if (!user) {
            res.json({ msg: 'login failed' });
        } else {
            let token = await user.generateToken();
            const data = { user, token };
            res.json({ data });
        }
    }).catch(next);
});

router.post('/signup', (req, res, next) => {
    let user = new User(req.body);
    user.save((err, doc) => {
        if (err) {
            return next(err);
        } else {
            res.json({ data: doc });
        }
    });
});

// path=/account/fitdata
router.post('/fitdata', auth(), (req, res) => {
    // Handle adding and updating fitness data
    res.json({});
});

// path=/account/passreset
router.post('/passreset', auth(), (req, res) => {
    // Handle password reset (Security Question)
    res.json({});
});


module.exports = router;

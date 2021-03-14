const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const User = require('../models/user');


const router = express();

router.use( auth({ role: 'A' }) );


router.get('/user/:id', (req, res) => {
    res.json(ok({}));
});

router.post('/user/:id', (req, res, next) => {
    let _id = req.params.id;
    User.findOne({ _id }).then(user => {
        if (!user) {
            throw new Error('Cannot find user');
        }
        const banned = ['_id', 'email'];
        const body = req.body;
        for (let i in body) {
            if ((i in user) && typeof user[i] !== 'function' && !banned.includes(i)) {
                user[i] = body[i];
            }
        }
        user.save((err, doc) => {
            if (err) {
                next(err);
            } else {
                res.json(ok(doc, 'Successfuly updated'));
            }
        });
    }).catch(next);
});

router.get('/user/search', (req, res) => {
    res.json(ok({}));
});


module.exports = router;

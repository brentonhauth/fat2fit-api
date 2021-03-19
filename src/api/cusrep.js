const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const Challenge = require('../models/challenge');
const UserRole = require('../config/userRole');

const router = express();

router.use(auth({ role: UserRole.CUSTOMER_REP }));

router.get('/challenges', (req, res, next) => {
    Challenge.find({}).then(docs => {
        res.json(ok(docs || []));
    }).catch(next);
});

router.post('/challenge/create', (req, res, next) => {
    const challenge = new Challenge(req.body);
    challenge.save((err, doc) => {
        if (err) next(err);
        else res.json(ok(doc));
    });
});

router.post('/challenge/:id', (req, res, next) => {
    let _id = req.params.id;
    Challenge.findOne({ _id }).then(doc => {
        if (!doc) throw new Error('Could not find challenge');
        const body = req.body;
        for (let i in body) {
            if ((i in doc) && typeof doc[i] !== 'function') {
                doc[i] = body[i];
            }
        }
        doc.save((err, result) => {
            if (err) next(err);
            else res.json(ok(result));
        });
    }).catch(next);
});


module.exports = router;

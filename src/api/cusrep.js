const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const Challenge = require('../models/challenge');
const Reward = require('../models/reward');
const UserRole = require('../config/userRole');

const router = express();

router.use(auth({ role: UserRole.CUSTOMER_REP }));

router.get('/challenges', (_req, res, next) => {
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

router.post('/reward/add', (req,res,next)=>{
    const reward = new Reward(req.body);
    reward.save((err, doc) =>{
        if (err) next(err);
        else res.json(ok(doc));
    });

});

router.post('/reward/edit/:id',(req, res, next) =>{
    let _id = req.params.id;
    Reward.findOne({_id}).then(doc =>{
        if (!doc) throw new Error('Could not find reward');
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

router.get('/rewards', (_req, res, next) => {
    Reward.find({}).then(rewards => {
        res.json(ok(rewards || []));
    }).catch(next);
});

router.post('/reward/create', (req, res, next) => {
    const reward = new Reward(req.body);
    reward.save((err, doc) => {
        if (err) next(err);
        else res.json(ok(doc));
    });
});

router.post('/reward/:id', (req, res, next) => {
    let _id = req.params.id;
    Reward.findOne({ _id }).then(reward => {
        if (!reward) {
            throw new Error('Cannot find user');
        }
        const banned = ['_id'];
        const body = req.body;
        for (let i in body) {
            if ((i in reward) && typeof reward[i] !== 'function' && !banned.includes(i)) {
                reward[i] = body[i];
            }
        }
        reward.save((err, doc) => {
            if (err) next(err);
            else res.json(ok(doc, 'Successfuly updated'));
        });
    }).catch(next);
});


module.exports = router;

const express = require('express').Router;
const auth = require('../middleware/auth');
const Group = require('../models/group');
const { ok } = require('../helpers/response');

const router = express();

// NOTE: All routes in this file are automatically appended to '/group/*'

// path=/group/create
router.post('/create', auth(), (req, res, next) => {
    let group = new Group({
        ...req.body,
        coach: req.user._id,
    });

    group.save((err, doc) => {
        if (err) {
            return next(err);
        }
        //Group.findOne({ _id: doc._id }).th;
        const payload = ok(doc);
        res.json(payload);
    });
});

router.put('/join/:id', auth(), (req, res, next) => {
    const groupId = req.params.id;
    const uid = req.user._id;

    Group.joinGroup(groupId, uid).then(doc => {
        const payload = ok(doc);
        res.json(payload);
    }).catch(next);
});

// must be placed at bottom of document
router.get('/:id', (req, res, next) => {
    const groupId = req.params.id;
    Group.getAllFor(groupId).then(data => {
        res.json(ok(data));
    }).catch(next);
});

module.exports = router;

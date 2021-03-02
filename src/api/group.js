const express = require('express').Router;
const auth = require('../middleware/auth');
const Group = require('../models/group');
const { ok } = require('../helpers/response');

const router = express();

// NOTE: All routes in this file are automatically appended to '/group/*'

// path=/group/create
router.post('/create', auth(), async (req, res, next) => {
    let group = new Group({
        ...req.body,
        coach: req.user._id,
    });

    try {
        await group.save();

        const select = ['_id', 'email', 'firstName', 'lastName'];
        let doc = await group.populate('coach', select).execPopulate();

        res.json(ok(doc));
    } catch (err) {
        return next(err);
    }
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

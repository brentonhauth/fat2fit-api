const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const User = require('../models/user');


const router = express();

router.get('/recommended', auth(), (req, res, next) => {
    const _id = req.user._id;

    User.findOne({ _id }).then(user => {
        return user.populate('workouts').execPopulate();
    }).then(user => {
        res.json(ok(user.workouts));
    }).catch(next);

    // TODO: Clean up recommendation process and add authentication to route
    // const uid = '_ID'; // req.user._id;
    // Activity.getRecommended(uid).then(activities => {
    //     // Currently wrapping activities as if it belongs to a group.
    //     const payload = ok({ activities });
    //     res.json(payload);
    // }).catch(next);
});


module.exports = router;

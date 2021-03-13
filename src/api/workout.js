const express = require('express').Router;
// const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const Activity = require('../models/activity');


const router = express();

router.get('/recommended', (req, res, next) => {
    // TODO: Clean up recommendation process and add authentication to route
    const uid = '_ID'; // req.user._id;
    Activity.getRecommended(uid).then(activities => {
        // Currently wrapping activities as if it belongs to a group.
        const payload = ok({ activities });
        res.json(payload);
    }).catch(next);
});


module.exports = router;

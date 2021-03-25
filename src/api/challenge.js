const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const Challenge = require('../models/challenge');
const Participant = require('../models/participant');
const ChallengeState = require('../config/challengeState');
// const ParticipantState = require('../config/participantState');

const router = express();

router.get('/available', (_req, res, next) => {
    const query = { $and: [
        { state: ChallengeState.AVAILABLE },
        { closes: { $gt: new Date(Date.now()) } }
    ]};

    Challenge.find(query).then(docs => {
        res.json(ok(docs || []));
    }).catch(next);
});

router.get('/active', auth(), (req, res, next) => {
    return next(new Error('Not implemented yet'));
});

router.get('/participate/:id', auth(), (req, res, next) => {
    const cid = req.params.id, uid = req.user._id;
    Participant.participate(cid, uid).then(par => {
        res.json(ok(par, 'Participated'));
    }).catch(next);
});

router.post('/progress/:id', auth(), (req, res, next) => {
    const cid = req.params.id, uid = req.user._id;
    const newDistance = req.body.distance;
    Participant.updateProgress(cid, uid, newDistance).then(par => {
        res.json(ok(par, 'Updated progress'));
    }).catch(next);
});


module.exports = router;

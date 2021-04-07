const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const Challenge = require('../models/challenge');
const Participant = require('../models/participant');
const ChallengeState = require('../types/challengeState.type');

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
    const uid = req.user._id;
    Participant.getActive(uid).then(active => {
        res.json(ok(active, 'Active challenges'));
    }).catch(next);
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

router.post('/add', auth(),(req,res,next)=>{
    var challenge = new Challenge(req.body);
    challenge.save((err,result) =>{
        if (err) {
            return next(err);
        }else{
            res.json( ok(result, "Challenge Created") );
        }
    });
});

router.post('/edit',auth(),(req,res,next)=>{

});

module.exports = router;

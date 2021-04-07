const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const Challenge = require('../models/challenge');
const Participant = require('../models/participant');
const Reward = require('../models/reward');
const UserRole = require('../types/userRole');
const ChallengeState = require('../types/challengeState');

const router = express();


// not yet linked to app


module.exports = router;

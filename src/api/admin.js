const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');


const router = express();

router.use( auth({ role: 'A' }) );


router.get('/user/:id', (req, res) => {
    res.json(ok({}));
});

router.post('/user/:id', (req, res) => {
    res.json(ok({}));
});

router.get('/user/search', (req, res) => {
    res.json(ok({}));
});


module.exports = router;

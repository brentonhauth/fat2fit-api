const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');


const router = express();

router.use( auth({ role: 'A' }) );

router.get('/', (req, res) => {
    res.json(ok({}));
});



module.exports = router;

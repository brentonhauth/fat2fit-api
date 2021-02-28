const express = require('express').Router;
const { ok } = require('../helpers/response');

const router = express();

// NOTE: All routes in this file are automatically appended to '/group/*'

// path=/group/create
router.post('/create', (req, res) => {
    res.json( ok({}) );
});

router.get('/get/:id', (req, res) => {
    res.json( ok({}) );
});

module.exports = router;

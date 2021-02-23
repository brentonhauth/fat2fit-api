const express = require('express').Router;

const router = express();

// NOTE: All routes in this file are automatically appended to '/group/*'

// path=/group/create
router.post('/create', (req, res) => {
    res.json({});
});

router.get('/get/:id', (req, res) => {
    res.json({});
});

module.exports = router;

const express = require('express').Router;

const router = express();


// NOTE: All routes in this file are automatically appended to '/account/*'

router.get('/info', (req, res) => {
    // getting account info
    res.json({});
});

// path=/account/login
router.post('/login', (req, res) => {
    // Handle login attempt
    res.json({});
});

module.exports = router;

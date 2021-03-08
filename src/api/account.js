const express = require('express').Router;
const User = require('../models/user');
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');

const router = express();


// NOTE: All routes in this file are automatically appended to '/account/*'

router.get('/info', auth(), (req, res) => {
    // getting account info
    res.json({});
});

// path=/account/login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    User.findByEmailAndPassword(email, password).then(async user => {
        if (!user) {
            res.json({ msg: 'login failed' });
        } else {
            let token = await user.generateToken();
            const payload = ok({ user, token });
            res.json(payload);
        }
    }).catch(next);
});

router.post('/signup', (req, res, next) => {
    let user = new User(req.body);
    user.save((err, doc) => {
        if (err) {
            return next(err);
        } else {
            res.json( ok(doc) );
        }
    });
});

// path=/account/fitdata
//update fitness data of user
router.post('/fitdata', auth(), (req, res) => {
    // Handle adding and updating fitness data

    const { height, waist, pushupScore, situpScore, freq } = req.body;
    // to make sure the user doesn't try to reset their password/email
    const data = { height, waist, pushupScore, situpScore, freq };

    let query = { _id: req.user._id };
    // will return new version of the doc
    const options = { new: true };
    
    User.findOneAndUpdate(query, data, options, function(err, result) {
        if(err){
            return next(err);
        }else{
            res.json(ok(result, "Update Complete"));
        }
    });
});

//path=/account/checkData
//this method return data based on token
router.post('/checkData',auth(), (req,res)=>{
    var email = req.user.email;
    User.find({}, function(err,result){
        if (err){
            return next(err);
        }else{
            res.json(ok(result));
        }
    });
});

// path=/account/passreset
router.post('/passreset', auth(), (req, res) => {
    // Handle password reset (Security Question)
    res.json( ok({}) );
});


module.exports = router;

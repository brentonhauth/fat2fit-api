const express = require('express').Router;
const User = require('../models/user');
const Password = require('../models/password');
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');

const router = express();


// NOTE: All routes in this file are automatically appended to '/account/*'

router.get('/info', auth(), (req, res, next) => {
    const _id = req.user._id;
    User.findOne({ _id }).then(user => {
        res.json(ok(user));
    }).catch(next);
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
    let password = new Password(req.body);
    console.log(password);
    user.save((err, doc) => {
        if (err) {
            return next(err);
        } else {
            password.save((err,result) => {
                if(err){
                    console.log(err);
                    return next(err);
                }
                else{
                    res.json( ok(doc, result) );
                }
            });
            
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

// path=/account/questions
router.get('/questions', (req, res) => {
    // Handle recieveing user questions 
    var email = req.body.email;
    Password.findOne({email},function(err,result){
        if (err){
            return next(err);
        }else{
            var questions = {"question1":result.question1,"question2":result.question2};
            res.json(ok(questions));
        }
    });
});

// path=/account/questions
router.post('/questions', (req, res,next) => {
    // Handle password reset (Security Question)
    var {email,answer1,answer2} = req.body;
    Password.findOne({email},function(err,result){
        if(err){
            return next(err);
        }else{
            if(result.answer1==answer1&&result.answer2==answer2){
                User.findOne({email},function(err,user){
                    if(err){
                        return next(err);
                    }else{
                        let token = user.generateToken();
                        const payload = ok({token});
                        res.json(payload);
                    }
                }).catch(next);
            }
        }
    });
});

// path=/account/passreset
router.post('/passreset', auth(), (req, res) => {
    var email = req.user.email;
    var password = req.body.password;
    User.findOne({email},function(err,user){
        if(err){
            return next(err);
        }else{
            console.log(user);
            user.password=password;
            user.save();
            res.json(ok(user, "Password Update Complete"));
        }
    });
});
module.exports = router;

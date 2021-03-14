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
    User.findByEmailAndPassword(email, password).then(user => {
        if (!user) {
            res.json({ msg: 'login failed' });
        } else {
            let token = user.generateToken();
            const payload = ok({ user, token });
            res.json(payload);
        }
    }).catch(next);
});

router.post('/signup', (req, res, next) => {
    req.body.role = 'U'; // prevents user from injecting admin role
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
                    res.json( ok(result, "Signed up") );
                }
            });
            
        }
    });
});

// path=/account/fitdata
//update fitness data of user
router.post('/fitdata', auth(), (req, res,next) => {
    // Handle adding and updating fitness data
    const { height, waist, pushupScore, situpScore, freq } = req.body;
    var id = req.user._id;
    User.findOne({'_id':id},function(err,user){
        if(err){
            return next(err);
        }else{
            user.height=height;
            user.waist=waist;
            user.pushupScore=pushupScore;
            user.situpScore=situpScore;
            user.freq=freq;
            user.save((err, doc) => {
                if (err) next(err);
                else res.json(ok(doc, "Fitness Data Update Complete"));
            });
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
router.get('/questions', (req, res, next) => {
    // Handle recieveing user questions 
    var email = req.query.email;
    Password.findOne({email},function(err,result){
        if (err){
            return next(err);
        }else if (!result){
            return next(new Error('No user found'));
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
        }else if (result && result.checkAnswers(answer1, answer2)) {
            User.findOne({email},function(err,user){
                if(err){
                    return next(err);
                }else{
                    let token = result.generateResetToken();
                    const payload = ok(token);
                    res.json(payload);
                }
            }).catch(next);
        } else {
            return next(new Error('Answers were not correct'));
        }
    });
});

// path=/account/passreset
router.post('/passreset', auth({action:'passreset'}), (req, res, next) => {
    var email = req.user.e; // just 'e'
    var password = req.body.password;
    User.findOne({email},function(err,user){
        if(err){
            return next(err);
        }else{
            user.password=password;
            user.save((err, doc) => {
                if (err) next(err);
                else res.json(ok(doc, "Password Update Complete"));
            });
        }
    });
});
module.exports = router;

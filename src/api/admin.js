const express = require('express').Router;
const auth = require('../middleware/auth');
const { ok } = require('../helpers/response');
const User = require('../models/user');


const router = express();

router.use( auth({ role: 'A' }) );


router.get('/user/:id', (req, res) => {
    res.json(ok({}));
});

router.post('/user/:id', (req, res, next) => {
    let _id = req.params.id;
    User.findOne({ _id }).then(user => {
        if (!user) {
            throw new Error('Cannot find user');
        }
        
        const body = req.body;
        for (let i in body) {
            if (body[i] && user[i] !== undefined) {
                user[i] = body[i];
            }
        }
        user.save((err, doc) => {
            if (err) {
                next(err);
            } else {
                res.json(ok(doc, 'Successfuly updated'));
            }
        });
    }).catch(next);
});

//returns all user infomation if requested by admin
//route /admin/users
router.get('/users', (req,res,next) =>{
    User.find({},function(err,result){
        if(err){
            return next(err);
        }else{
            res.json(ok(result));
        }
    });
});

//returns user infomation based on email sent
//route /admin/search
router.post('/search', (req, res,next) => {
    var email = req.body.email;
    User.find({'email':email}, function(err,result){
        if(err){
            return next(err);
        }else{
            res.json(ok(result));
        }
    });
});


module.exports = router;

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const config = require('../config');
const isEmail = validator.isEmail || validator.default.isEmail;

 const passwordSchema = new mongoose.Schema( {
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    question1:{
        type: String,
        trim: true,
        required: true
    },
    question2:{
        type: String,
        trim: true,
        required: true
    },
    answer1:{
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    answer2:{
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
});

passwordSchema.methods.generateResetToken = function() {
    const payload = {
        action: 'passreset',
        e: this.email,
        ts: Date.now(),
    };
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
};

passwordSchema.methods.checkAnswers = function(answer1, answer2) {
    const result = this;
    answer1 = answer1.toLowerCase();
    answer2 = answer2.toLowerCase();
    return result.answer1 === answer1
        && result.answer2 === answer2;
};


const password = mongoose.model('password', passwordSchema);

module.exports = password;
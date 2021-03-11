const mongoose = require('mongoose');
const validator = require('validator');
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
        required: true
    },
    question2:{
        type: String,
        required: true
    },
    answer1:{
        type: String,
        required: true
    },
    answer2:{
        type: String,
        required: true
    },
});
const password = mongoose.model('password', passwordSchema);

module.exports = password;
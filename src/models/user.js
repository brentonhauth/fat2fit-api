const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const config = require('../config');
const isEmail = validator.isEmail || validator.default.isEmail;
const isStrongPassword = validator.isStrongPassword || validator.default.isStrongPassword;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
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
    password: {
        type: String,
        required: true,
        minLength: 8,
        validate(value) {
            if (!isStrongPassword(value, { minLength: 8 })) {
                throw new Error('Invalid password');
            }
        }
    },
});

userSchema.pre('save', async function(next) {
    const usr = this;
    if (usr.isModified('password')) {
        usr.password = await bcrypt.hash(usr.password, 8);
    }
    next()
})

userSchema.methods.generateToken = function() {
    const payload = {
        _id: this._id,
        ts: Date.now(),
    };
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });
};

userSchema.statics.findByEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid login');
    }
    
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
        throw new Error('Invalid login');
    }
    
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

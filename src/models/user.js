const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const config = require('../config');
const UserRole = require('../config/userRole');
const Gender = require('../config/gender');
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

    age: {
        type: Number,
        min: 13,
        max: 120,
        default: 20,
    },

    gender: {
        type: String,
        enum: [Gender.MALE, Gender.FEMALE],
        required: true,
        default: Gender.MALE,
    },

    role: {
        type: String,
        enum: [
            UserRole.END_USER,
            UserRole.ADMIN,
            UserRole.CUSTOMER_REP,
        ],
        default: UserRole.END_USER
    },
    height:{
        type: Number,
        min:[0, 'Negative values are not allowed']
    },
    waist:{
        type: Number,
        min:[0, 'Negative values are not allowed']
    },
    pushupScore:{
        type: Number,
        min:[0, 'Negative values are not allowed']
    },
    situpScore:{
        type: Number,
        min:[0, 'Negative values are not allowed']
    },
    freq:{
        type: Number,
        min:[0, 'Negative values are not allowed']
    },

    workouts: [{
        ref: 'Workout',
        type: mongoose.Schema.Types.ObjectId,
    }]
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
        email: this.email,
        role: this.role,
        ts: Date.now(),
    };
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });
};

userSchema.methods.calcRfm = function() {
    const user = this;
    const MAGIC = user.gender === Gender.MALE ? 64 : 76;
    return MAGIC - (20 * user.height / user.waist);
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

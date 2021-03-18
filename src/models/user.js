const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const config = require('../config');
const UserRole = require('../config/userRole');
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

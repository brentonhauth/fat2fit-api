const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Gender = require('../config/gender');

const workoutSchema = new mongoose.Schema({
    repetition: {
        type: Number,
        required: true,
    },

    age: {
        type: Number,
        required: true,
        min: 13,
        max: 120,
    },

    rfm: {
        type: Number,
        required: true,
        min: 1,
    },

    workoutName: {
        type: String,
        required: true,
        trim: true,
    },

    videoHyperlink: {
        type: String,
        required: true,
        trim: true,
    },

    workoutName: {
        type: String,
        required: true,
        trim: true,
    },

    gender: {
        type: String,
        enum: [Gender.MALE, Gender.FEMALE],
        required: true
    },
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;

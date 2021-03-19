const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },

    distance: {
        type: Number,
        min: 1,
    },

    reward: {
        ref: 'Reward',
        type: mongoose.Schema.Types.ObjectId
    }
});



const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;

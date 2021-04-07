const mongoose = require('mongoose');
const ChallengeState = require('../types/challengeState.type');
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

    state: {
        type: String,
        enum: [
            ChallengeState.AVAILABLE,
            ChallengeState.HIDDEN,
            ChallengeState.FINISHED,
        ],
        default: ChallengeState.AVAILABLE
    },

    closes: {
        type: Date,
        required: true,
        default() {
            const date = new Date(Date.now());
            date.setMonth(date.getMonth() + 1);
            return date; // One month from now
        }
    },

    reward: {
        ref: 'Reward',
        type: mongoose.Schema.Types.ObjectId
    }
});



const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;

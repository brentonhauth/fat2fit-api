const mongoose = require('mongoose');
const ChallengeState = require('../types/challengeState.type');
const ParticipantState = require('../types/participantState.type');
const Challenge = require('./challenge');
const User = require('./user');
const ObjectId = mongoose.Schema.Types.ObjectId;


const participantSchema = new mongoose.Schema({
    progress: {
        type: Number,
        min: 0,
        default: 0,
    },

    checkpoint: {
        type: Date,
        // default: Date.now()
    },

    challenge: {
        ref: 'Challenge',
        type: ObjectId
    },

    user: {
        ref: 'User',
        type: ObjectId
    },

    state: {
        type: String,
        enum: [
            ParticipantState.ACTIVE,
            ParticipantState.COMPLETED,
            ParticipantState.DROPPED,
            ParticipantState.UNFINISHED,
        ],
        default: ParticipantState.ACTIVE,
    }
});


participantSchema.pre('save', function(next) {
    const participant = this;
    if (participant.isModified('checkpoint')) {
        return next(new Error('Cannot modify checkpoint'));
    } else if (participant.isModified('progress')) {
        participant.checkpoint = Date.now();
    }
    return next();
});


participantSchema.statics.updateProgress = async (challenge, user, newDistance) => {
    const participant = await Participant.findOne({ $and: [{challenge}, {user}] });
    if (!participant) {
        throw new Error('Not a challenge participant');
    } else if (participant.state !== ParticipantState.ACTIVE) {
        throw new Error(`Not active participant (State: ${participant.state})`);
    }
    
    /** 
     * @todo use userObj, checkpoint & stride formula
     *       to determine if distance is possible
     */
    const [userObj, challengeObj] = await Promise.all([
        User.findOne({ _id: user }),
        Challenge.findOne({ _id: challenge })
    ]);

    // const oldDistance = participant.progress;
    
    if (challengeObj.state !== ChallengeState.AVAILABLE) {
        throw new Error('Challenge is not available');
    }

    if (newDistance >= challengeObj.distance) {
        participant.state = ParticipantState.COMPLETED;
    }
    participant.progress = newDistance;

    await participant.save();
    return participant.populate('challenge').populate('user').execPopulate();
};


participantSchema.statics.getActive = function(uid) {
    console.log('UID',uid);
    return Participant.aggregate([
        {$match: { user: mongoose.Types.ObjectId(uid), state: ParticipantState.ACTIVE }},
        {$lookup: {
            from: 'challenges', localField: 'challenge',
            foreignField: '_id', as: 'challenge'
        }},
        {$unwind: { path: '$challenge' }},
        {$match: { 'challenge.state': ChallengeState.AVAILABLE }}
    ]).exec();
};

participantSchema.statics.participate = async (cid, uid) => {
    if (!mongoose.isValidObjectId(cid)) {
        throw new Error('Invalid challenge id');
    }

    let [participant, challenge] = await Promise.all([
        Participant.findOne({ $and: [{challenge:cid}, {user:uid}] }),
        Challenge.findOne({ _id: cid }),
    ]);

    if (!challenge || challenge.state !== ChallengeState.AVAILABLE) {
        throw new Error('Cannot participate in challenge');
    } else if (participant) {
        if (participant.state === ParticipantState.DROPPED) {
            participant.state = ParticipantState.ACTIVE;
            return participant.save();
        } else {
            throw new Error('Already a participant');
        }
    } else {
        participant = new Participant({
            challenge: mongoose.Types.ObjectId(cid),
            user: mongoose.Types.ObjectId(uid),
        });
    }
    await participant.save();
    return participant.populate('challenge')
        .populate('challenge.reward')
        .populate('user')
        .execPopulate();
};


const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;

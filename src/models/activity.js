const mongoose = require('mongoose');
const Group = require('./group');
const ObjectId = mongoose.Types.ObjectId;


/**
 * @type {Record<string, mongoose.SchemaDefinitionProperty>}
 */
const definitions = {
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

    hyperlink: {
        type: String,
        lowercase: true,
        trim: true,
        match: /^(https?:\/\/)?[\w\.:\-\/=#&?]+$/i // quick check
    },

    actType: {
        type: String,
        enum: [
            'A', // Group Activity
            'W', // Static workouts
            'C', // Challenges
        ],
        default: 'A'
    },

    created: {
        type: Date,
        default: Date.now
    }
};

const activitySchema = new mongoose.Schema(definitions);

activitySchema.statics.createNew = async (groupId, uid, activityData) => {
    const group = await Group.findById(groupId.toUpperCase());
    if (!group) {
        throw new Error('Group doesn\'t exist');
    } else if (!group.coach.equals(uid)) {
        throw new Error('User is not this group\'s coach');
    }

    let activity = new Activity(activityData);

    const doc = await activity.save();

    group.activities.push(new ObjectId(doc._id));
    await group.save();

    return doc;
};

activitySchema.statics.getRecommended = async function(uid) {
    if (typeof uid !== 'string') {
        throw new Error('Invalid user id');
    }
    // TODO: Connect user ID to recommendations

    let workouts = await Activity.find({ actType: 'W' });
    return workouts;
};


const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

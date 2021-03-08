const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;


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

    descriptions: {
        type: String,
        trim: true,
        maxlength: 500,
    },

    hyperlink: {
        type: String,
        lowercase: true,
        trim: true,
        match: /^(https?:\/\/)?[\w\.:]+$/i // quick check
    },

    created: {
        type: Date,
        default: Date.now
    }
};

const activitySchema = new mongoose.Schema(definitions);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

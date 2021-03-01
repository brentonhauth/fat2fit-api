const MAX_CODE = parseInt('ZZZZZ', 36);
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @typedef {mongoose.SchemaDefinitionProperty} SchemaDef
 */
//

const generateCode = () => {
    // NOTE: although highly unlikely, there still is a chance for id collisions
    const code = Math.round(Math.random() * MAX_CODE);
    return code.toString(36).toUpperCase().padStart(6, '0');
};

/**
 * @type {Record<string, SchemaDef|SchemaDef[]>}
 */
const definitions = {
    _id: {
        type: String,
        default: generateCode,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
};

/** */
const groupSchema = new mongoose.Schema(definitions);

groupSchema.statics.joinGroup = (groupId, uid) => {
    if (typeof groupId !== 'string') {
        return Promise.reject(new Error('Invalid group id.'));
    }

    return new Promise((resolve, reject) => {
        const query = { $addToSet: { members: new ObjectId(uid) } };
        groupId = groupId.toUpperCase();
        Group.findByIdAndUpdate(groupId, query, { new: true }, (err, doc) => {
            if (err) reject(err);
            else resolve(doc);
        });
    });
};

groupSchema.statics.getAllFor = groupId => {
    if (typeof groupId !== 'string') {
        return Promise.reject(new Error('Invalid group id.'));
    }
    // Leaves out password
    const select = ['_id', 'email', 'firstName', 'lastName'];
    return Group.findOne({ _id: groupId.toUpperCase() })
        .populate('members', select)
        .populate('coach', select).exec().then(group => {
            if (group) return group;
            throw new Error('No group found.');
        });
    //
};

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

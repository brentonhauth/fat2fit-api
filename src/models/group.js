const MAX_CODE = parseInt('ZZZZZZ', 36);
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

    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
    }],
};

/** */
const groupSchema = new mongoose.Schema(definitions);

groupSchema.statics.joinGroup = async (groupId, uid) => {
    if (typeof groupId !== 'string') {
        throw new Error('Invalid group id.');
    };
    
    groupId = groupId.toUpperCase();
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Group doesn\'t exist');
    }

    const isAlreadyMember = group.members.some(m => m.equals(uid));

    if (isAlreadyMember || group.coach.equals(uid)) {
        throw new Error('You\'re already a member.');
    }

    group.members.push(new ObjectId(uid));
    await group.save();

    const select = ['_id', 'email', 'firstName', 'lastName'];
    return group.populate('members', select)
        .populate('coach', select)
        .populate('activities')
        .execPopulate();
};

groupSchema.statics.leaveGroup = async (groupId, uid) => {
    if (typeof groupId !== 'string') {
        throw new Error('Invalid group id.');
    }

    groupId = groupId.toUpperCase();
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Group doesn\'t exist');
    }

    const index = group.members.findIndex(m => m.equals(uid));

    if (group.coach.equals(uid) || index === -1) {
        throw new Error('User is not a group member');
    }

    group.members.splice(index, 1);
    await group.save();
    return groupId;
};

groupSchema.statics.getMine = async uid => {
    if (typeof uid === 'string') {
        uid = ObjectId(uid);
    }
    const select = ['_id', 'email', 'firstName', 'lastName'];
    return Group.find({
        $or: [{ coach: uid }, { members: uid }]
    }).populate('members', select)
    .populate('coach', select)
    .populate('activities').exec();
};

groupSchema.statics.getAllFor = groupId => {
    if (typeof groupId !== 'string') {
        return Promise.reject(new Error('Invalid group id.'));
    }
    // Leaves out password
    const select = ['_id', 'email', 'firstName', 'lastName'];
    return Group.findOne({ _id: groupId.toUpperCase() })
        .populate('members', select)
        .populate('coach', select)
        .populate('activities').exec().then(group => {
            if (group) return group;
            throw new Error('No group found.');
        });
    //
};

groupSchema.statics.removeMember = async (groupId, selfId, memberId) => {
    if (!groupId || typeof groupId !== 'string') {
        throw new Error('Invalid group id.');
    }
    const group = await Group.findOne({ _id: groupId.toUpperCase() });
    if (!group) {
        throw new Error('Cannot find group!');
    }

    const index = group.members.findIndex(m => m.equals(memberId));
    if (!group.coach.equals(selfId) || index === -1) {
        throw new Error('Cannot remove member');
    }
    group.members.splice(index, 1);
    await group.save();
    const select = ['_id', 'email', 'firstName', 'lastName'];
    return group.populate('members', select)
        .populate('coach', select)
        .populate('activities')
        .execPopulate();
};

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

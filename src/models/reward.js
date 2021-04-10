const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const rewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    company: {
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
    }
});



const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;

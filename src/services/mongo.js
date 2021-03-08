const mongoose = require('mongoose');
const config = require('../config');

/** @type {typeof mongoose} */
let connection;

module.exports = async () => {
    if (!connection) {
        connection = await mongoose.connect(config.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true 
        }).catch(console.error);
        
        require('../models/user');
        require('../models/activity');
        require('../models/group');
    }
    return connection;
};

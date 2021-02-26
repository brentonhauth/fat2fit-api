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
    }
    return connection;
};
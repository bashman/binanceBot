const mongoose = require('mongoose');

const { Schema } = mongoose;


const userSchema = new Schema({
    uuid: String,
    username: String,
    password: String,
}, { strict: false, timestamps: true });

const accountDb = mongoose.model('users', userSchema)

module.exports = accountDb;
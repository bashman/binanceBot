const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
    uuid: String,
    type: String,
    price: Number,
    amount: Number
}, { strict: false, timestamps: true });

const accountDb = mongoose.model('transactions', transactionSchema)

module.exports = accountDb;
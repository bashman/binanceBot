const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
    uuid: String,
    symbol: String,
    type: String,
    price: String,
    quantity: String
}, { strict: false, timestamps: true });

const accountDb = mongoose.model('transactions', transactionSchema)

module.exports = accountDb;
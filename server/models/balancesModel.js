const mongoose = require('mongoose');

const { Schema } = mongoose;

const assetSchema = new Schema({
    symbol: String,
    balanceUSD: Number,
    balanceBTC: Number, 
    priceUSD: Number,
    priceBTC: Number
});


const balanceSchema = new Schema({
    uuid: String,
    balanceUSD: Number,
    balanceBTC: Number,
    assets: [assetSchema]
}, { strict: false, timestamps: true });

const accountDb = mongoose.model('balances', balanceSchema)

module.exports = accountDb;
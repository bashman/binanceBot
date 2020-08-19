const express = require('express');
const router = express.Router();
const axios = require("axios");
const sign = require('../utils/signature');
const uuid = require('uuid');

const balancesDB = require('../models/balancesModel');
const transactionsDB = require('../models/transactionModel');


router.get('/balances/:timeframe', async (req, res) => {
    try {
    
        const { timeframe } = req.params;

        let balanceData;

        if (timeframe === '2h') {
            balanceData = await balancesDB.find().sort({$natural: -1}).limit(30);
            balanceData.reverse();
        } else if (timeframe === '1d') {
            console.log('here')
            balanceData = await balancesDB.find().sort({$natural:-1}).limit(30 * 12);
            balanceData = balanceData.filter((balance, i) => i % 12 === 0).reverse();
        }

        res.status(200).json(balanceData)
    } catch(error) {
        console.log(error)
    }

});

router.get('/transactions', async (req, res) => {

    try {
        let transactions = await transactionsDB.find().sort({$natural:-1}).limit(100);

        res.status(200).json(transactions)
    } catch(error) {
        console.log(error)
    }

});

module.exports = router;
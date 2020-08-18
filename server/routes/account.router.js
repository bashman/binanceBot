const express = require('express');
const router = express.Router();
const axios = require("axios");
const sign = require('../utils/signature');
const uuid = require('uuid');

const balancesDB = require('../models/balancesModel');
const transactionsDB = require('../models/transactionModel');


router.get('/balances', async (req, res) => {

    try {
        let balanceData = await balancesDB.find().sort({$natural:-1}).limit(100);

        res.status(200).json(balanceData.reverse())
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
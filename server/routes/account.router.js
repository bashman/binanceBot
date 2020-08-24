const express = require('express');
const router = express.Router();
const axios = require("axios");
const sign = require('../utils/signature');
const uuid = require('uuid');
const tokenVerify = require('./verify.router');

const balancesDB = require('../models/balancesModel');
const transactionsDB = require('../models/transactionModel');


router.get('/balances/:timeframe', async (req, res) => {
    try {
    
        const { timeframe } = req.params;

        let balanceData;

        if (timeframe === '2h') {
            balanceData = await balancesDB.find().sort({$natural: -1}).limit(20);
            balanceData.reverse();
        } else if (timeframe === '1d') {
            balanceData = await balancesDB.find().sort({$natural:-1}).limit(20 * 12);
            balanceData = balanceData.filter((balance, i) => i % 12 === 0).reverse();
        }

        res.status(200).json(balanceData)
    } catch(error) {
        console.log(error)
    }

});

router.get('/transactions', async (req, res) => {

    try {
		let transactions = await transactionsDB.find().sort({$natural:-1}).limit(15);
		

		let statistics = {
			numOfBuys: 0,
			numOfSells: 0,
			avgBuyPrice: 0,
			avgSellPrice: 0,
		}

		let buyTotal = 0;
		let sellTotal = 0;

		transactions.forEach(transaction => {

			if (transaction.type === 'BUY')  {
				statistics.numOfBuys++;
				buyTotal += Number(transaction.price);
			}  else {
				statistics.numOfSells++;
				sellTotal += Number(transaction.price);
			}
		})

		statistics.avgBuyPrice = buyTotal / statistics.numOfBuys ? buyTotal / statistics.numOfBuys : 0;
		statistics.avgSellPrice = sellTotal / statistics.numOfSells ? sellTotal / statistics.numOfSells : 0;


        res.status(200).json({ transactions, statistics})
    } catch(error) {
        console.log(error)
    }

});

module.exports = router;
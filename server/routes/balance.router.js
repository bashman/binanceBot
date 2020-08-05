const express = require('express');
const router = express.Router();
const axios = require("axios");
const sign = require('../utils/signature');
const uuid = require('uuid');

const accountDB = require('../models/balancesModel');


router.get('/balanceData', async (req, res) => {

    try {
        let balanceData = await accountDB.find().sort({$natural:-1}).limit(20);

        res.status(200).json(balanceData.reverse())
    } catch(error) {
        console.log(error)
    }

});


module.exports = router;
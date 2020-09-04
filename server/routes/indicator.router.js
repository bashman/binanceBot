const express = require('express');
const router = express.Router();
const axios = require("axios");
const tokenVerify = require('./verify.router');

const Binance = require('node-binance-us-api');
const binance = new Binance().options({
  APIKEY: process.env.BOT_API_KEY,
  APISECRET: process.env.BOT_SECRET_KEY
});

var Indicators = require('technicalindicators');


router.get('/stochrsi', tokenVerify, async(req,res) => {
    try {
        binance.candlesticks("BTCUSDT", "2h", async (error, ticks, symbol) => {
            try {

                // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;


                let closes = ticks.map(tick => tick[4]);
                let timestamps = ticks.map(tick => tick[0]);



                let stochrsi = await Indicators.StochasticRSI.calculate({
					values: closes,
					rsiPeriod: 14, 
                    stochasticPeriod: 14, 
                    kPeriod:5, 
                    dPeriod:2
				});
				
                timestamps.splice(0, timestamps.length - stochrsi.length)

                res.send({timestamps: timestamps, stochrsi}).status(200);
            } catch(error) {
                console.log(error)
            }
          }, {limit: 140});

    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;

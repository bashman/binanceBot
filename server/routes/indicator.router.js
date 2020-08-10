const express = require('express');
const router = express.Router();
const axios = require("axios");

const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.envBINANCE_SECRET_KEY
});

var Indicators = require('technicalindicators');


router.get('/stochrsi', async(req,res) => {
    try {
        binance.candlesticks("BTCUSDT", "5m", async (error, ticks, symbol) => {
            try {

                // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;


                let closes = ticks.map(tick => tick[4]);
                let timestamps = ticks.map(tick => tick[0]);

                

                let stochrsi = await Indicators.StochasticRSI.calculate({
                    values: closes, rsiPeriod: 14, 
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

const axios = require("axios");
const Average = require('average');

const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_SECRET_KEY
});


const binance2 = require('binance');


const binanceWS = new binance2.BinanceWS(true);


// binanceWS.ticker('BTCUSDT', data => {
//     console.log(data);
// });

var Indicators = require('technicalindicators');

// DB
const transactionsDB = require('../models/transactionModel');

const trading = async() => {
    try {

        const symbol = 'BTCUSDT'
        binance.candlesticks(symbol, "1d", async (error, ticks, symbol) => {
            try {

                // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;


                let closes = ticks.map(tick => tick[4]);
                let timestamps = ticks.map(tick => tick[0]);
                

                let stochrsi = await Indicators.StochasticRSI.calculate({values: closes, rsiPeriod: 14, stochasticPeriod: 14, kPeriod:5, dPeriod:2});

                let macd = await Indicators.MACD.calculate({
                    values: closes.map(close => Number(close)),
                    fastPeriod: 12,
                    slowPeriod: 26,
                    signalPeriod: 9,
                })

                macd = macd.filter(md => md.histogram);

                closes.splice(0, closes.length - macd.length);
                stochrsi.splice(0, stochrsi.length - macd.length);
                timestamps.splice(0, timestamps.length - macd.length);


                let buyCount = 0;
                let sellCount = 0;

                let transactions = [];

                let buys = [];
                let trades = [];

                for (let i=0; i< stochrsi.length; i++) {
                    let stochData = stochrsi[i];
                    

                    let latestK = stochData.k;
                    let latestD = stochData.d;


                    if ((latestK >= latestD ) 
                        && latestK < 20 
                        && latestD < 20) {
                        // buy
                        buyCount++;

                        
                        // transactions.push({price: closes[i], time: new Date(timestamps[i]).toISOString().slice(11, -1), type: 'buy'})
                        buys.push(closes[i]);
                    } 
                    else if ( i > 0 && stochrsi[i].k < stochrsi[i-1].k && stochrsi[i-1].k < 20 & stochrsi[i-1].d < 20) {
                        buyCount++;

                        // transactions.push({price: closes[i], time: new Date(timestamps[i]).toISOString().slice(11, -1), type: 'buy'});
                        buys.push(closes[i]);
                    } else if (latestK < latestD && latestK < 80 && latestD < 80) {
                        sellCount++;
                        // sell

                        // transactions.push({price: closes[i], time: new Date(timestamps[i]).toISOString().slice(11, -1), type: 'sell'})

                        if (buys[0]) {
                            // console.log(closes[i]);
                            // console.log(buys.pop())
                            // console.log(closes[i] - buys.pop(), new Date(timestamps[i]).toISOString().slice(11, -1), closes[i]);
                            // console.log(closes[i]);
                            // console.log(buys.pop())

                            trades.push(closes[i] - buys.pop())
                        }
                    }
                }

                console.log(Average(trades))
                // // // console.log(transactions.sort((a,b) => a.time > b.time ? 1 : -1))
                // console.log(new Date().toISOString().slice(11, -1))


            } catch(error) {
                console.log(error)
            }
          }, {limit: 140});

    }catch(error) {
        console.log(error)
    }
}

module.exports = trading;
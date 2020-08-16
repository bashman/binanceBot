const axios = require("axios");
const uuid = require('uuid');
const Average = require('average');
const schedule = require('node-schedule');

const Binance = require('node-binance-us-api');
const binance = new Binance().options({
  APIKEY: process.env.BOT_API_KEY,
  APISECRET: process.env.BOT_SECRET_KEY
});




// const binanceWS = new binance2.BinanceWS(true);


// binanceWS.ticker('BTCUSDT', data => {
//     console.log(data);
// });

const Indicators = require('technicalindicators');

// DB
const transactionsDB = require('../models/transactionModel');

const trading = async() => {
    try {

        const symbol = 'BTCUSDT'
        binance.candlesticks(symbol, "4h", async (error, ticks, symbol) => {
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

                await createTrade(stochrsi);


                // let buyCount = 0;
                // let sellCount = 0;

                // let transactions = [];

                // let buys = [];
                // let trades = [];

                // for (let i=0; i< stochrsi.length; i++) {
                //     let stochData = stochrsi[i];
                    

                //     let latestK = stochData.k;
                //     let latestD = stochData.d;


                //     if ((latestK >= latestD ) 
                //         && latestK < 20 
                //         && latestD < 20) {
                //         // buy
                //         buyCount++;

                        
                //         // transactions.push({price: closes[i], time: new Date(timestamps[i]).toISOString().slice(11, -1), type: 'buy'})
                //         buys.push(closes[i]);
                //     } 
                //     else if ( i > 1 && stochrsi[i].k < stochrsi[i-1].k && stochrsi[i-1].k < 20 & stochrsi[i-1].d < 20) {
                //         buyCount++;

                //         // transactions.push({price: closes[i], time: new Date(timestamps[i]).toISOString().slice(11, -1), type: 'buy'});
                //         buys.push(closes[i]);
                //     } else if (latestK < latestD && latestK > 80 && latestD > 80) {
                //         sellCount++;
                //         // sell

                //         // transactions.push({price: closes[i], time: new Date(timestamps[i]).toISOString().slice(11, -1), type: 'sell'})

                //         if (buys[0]) {
                //             // console.log(closes[i]);
                //             // console.log(buys.pop())
                //             // console.log(closes[i] - buys.pop(), new Date(timestamps[i]).toISOString().slice(11, -1), closes[i]);
                //             // console.log(closes[i]);
                //             // console.log(buys.pop())

                //             trades.push(closes[i] - buys.pop())
                //         }
                //     }
                // }

                // console.log(Average(trades))
                // // // console.log(transactions.sort((a,b) => a.time > b.time ? 1 : -1))
                // console.log(new Date().toISOString().slice(11, -1))


            } catch(error) {
                console.log(error)
            }
          }, {limit: 140, endTime: new Date().getTime()});

    }catch(error) {
        console.log(error)
    }
}

const createTrade = async (stochRSI) => {

    // antepenK

    let penultK = stochRSI[stochRSI.length-2].k;
    let penultD = stochRSI[stochRSI.length-2].d;

    let latestK = stochRSI[stochRSI.length-1].k;
    let latestD = stochRSI[stochRSI.length-1].d;

    console.log('latest',latestK,latestD);

    let response = null;

    let recentTransaction = await transactionsDB.findOne(
        {createdAt: { // 20 minutes ago (from now)
            $gte: new Date().getTime()-(20*60*1000)
        }}).limit(1).sort({ createdAt:-1})

    
        console.log(recentTransaction)

    try {
        if (!recentTransaction) {

            if ((latestK >= latestD ) 
            && latestK < 20 
            && latestD < 20) {
                // buy

                response = await binance.marketBuy("BTCUSDT", .0033);
            } else if (latestK < penultK && penultD < 20 && latestD < 20) {
                // buy

                response = await binance.marketBuy("BTCUSDT", .0033);
            } else if (latestK < latestD && latestK > 80 && latestD > 80) {
                // sell
                response = await binance.marketSell("BTCUSDT", .0033);
            } else {
                console.log('no trade');
                // response = await binance.marketSell("BTCUSDT", .0033);
            }

            if (response) {
                await transactionsDB.create({
                    uuid: uuid.v1(),
                    symbol: response.symbol,
                    type: response.side,
                    price: response.fills[0].price,
                    quantity: response.executedQty
                });

                console.log(response);

            }

        }



    } catch(error) {
        console.log(error)
    }

}


const runScript = () => {
    schedule.scheduleJob('*/15 * * * *', function(){
        trading();
      });
}



module.exports = runScript;
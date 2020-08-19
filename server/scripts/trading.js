const axios = require("axios");
const uuid = require('uuid');
const Average = require('average');
const schedule = require('node-schedule');

const Binance = require('node-binance-us-api');
const binance = new Binance().options({
  APIKEY: process.env.BOT_API_KEY,
  APISECRET: process.env.BOT_SECRET_KEY
});



const Indicators = require('technicalindicators');

// DB
const transactionsDB = require('../models/transactionModel');


const trading = async() => {
    try {

        const symbol = 'BTCUSDT'
        binance.candlesticks(symbol, "2h", async (error, ticks, symbol) => {
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

                const btcPrice = closes[closes.length - 1];

                await createTrade(stochrsi, btcPrice);

            } catch(error) {
                console.log(error)
            }
          }, {limit: 140});

    }catch(error) {
        console.log(error)
    }
}

const createTrade = async (stochRSI, btcPrice) => {

    
    const { balances } = await binance.account();

    const { free: btcBalance } = balances.find( asset => asset.asset === 'BTC');
    const { free: usdBalance } = balances.find( asset => asset.asset === 'USDT');

    const penultK = stochRSI[stochRSI.length-2].k;
    const penultD = stochRSI[stochRSI.length-2].d;

    const latestK = stochRSI[stochRSI.length-1].k;
    const latestD = stochRSI[stochRSI.length-1].d;

    console.log('latest', latestK, latestD);

	let response = null;
	
	console.log(usdBalance)

    try {

        let buyAmount = (usdBalance / 10) / btcPrice;
        buyAmount = Number(buyAmount).toFixed(4)
        const sellAmount = btcBalance / 10;

        if (latestK >= latestD  && latestK < 20 && latestD < 20 && (usdBalance > buyAmount * btcPrice)) {
            // buy

            response = await binance.marketBuy("BTCUSDT", buyAmount);
        } else if (latestK < penultK && penultD < 20 && latestD < 20 && (usdBalance > buyAmount * btcPrice)) {
            // buy

            response = await binance.marketBuy("BTCUSDT", buyAmount);
        } else if (latestK < latestD && latestK > 80 && latestD > 80 && btcBalance > sellAmount) {
            // sell
            response = await binance.marketSell("BTCUSDT", sellAmount);
        } else {
            console.log('no trade');
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

    } catch(error) {
        console.log(error)
    }

}


const runScript = () => {
    schedule.scheduleJob('0 */2 * * *', function() {
        trading();
    });
}



module.exports = runScript;
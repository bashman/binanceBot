const axios = require("axios");
const uuid = require('uuid');
const Average = require('average');
const schedule = require('node-schedule');
const moment = require('moment');

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

		console.log(new Date().toUTCString())

        const symbol = 'BTCUSDT'
        await binance.candlesticks(symbol, "2h", async (error, ticks, symbol) => {
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
				
				stochrsi = stochrsi.map(stoch => { return {k: stoch.k.toFixed(2), d: stoch.d.toFixed(2), stochRSI: stoch.stochRSI }});

                const btcPrice = closes[closes.length - 1];

				let latestTransaction = await transactionsDB.findOne({createdAt : {$gt: new Date(Date.now()-(2 * 60 * 60 * 1000)) }});
				if (!latestTransaction) {
					await createTrade(stochrsi, btcPrice);
				} else {
					console.log('2 hour dead period')
				}

            } catch(error) {
                console.log(error.body)
            }
          }, {limit: 140});

    }catch(error) {
        console.log(error.body)
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
	console.log('usdBalance', usdBalance);
	console.log('btcBalance', btcBalance);

	let response = null;
	

    try {

        let buyAmount = Number((usdBalance / 10) / btcPrice).toFixed(4);
		let sellAmount = Number(btcBalance / 10).toFixed(4);

		if (usdBalance >=  .001 * btcPrice) {
			buyAmount = buyAmount > .001 ? buyAmount : .001 
		}

		if (btcBalance >= .001) {
			sellAmount = sellAmount > .001 ? sellAmount : .001 
		}

        if (latestK >= latestD  && latestK < 20 && latestD < 20 && (usdBalance > buyAmount * btcPrice) && buyAmount > .001) {
            // buy

            response = await binance.marketBuy("BTCUSDT", buyAmount);
        } else if (latestK < penultK && penultD < 20 && latestD < 20 && (usdBalance > buyAmount * btcPrice) && buyAmount > .001 ) {
            // buy

            response = await binance.marketBuy("BTCUSDT", buyAmount);
        } else if (latestK < latestD && latestK > 80 && latestD > 80 && btcBalance > sellAmount && sellAmount > .001) {
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

            console.log('transaction response', response);
        }

    } catch(error) {
        console.log(error.body)
    }

}


const runScript = () => {
    schedule.scheduleJob('*/5 * * * *', function() {
		console.log('scheduler')
        trading();
    });
}



module.exports = runScript;
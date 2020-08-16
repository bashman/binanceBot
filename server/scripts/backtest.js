const Binance = require('node-binance-api');
const Indicators = require('technicalindicators');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_SECRET_KEY
});


const backTestTrading = async () => {



    binance.candlesticks("BTCUSDT", "4h", async (error1, ticks1, symbol1) => {
        let closes1 = ticks1.map(tick => tick[4]);
        let timestamps1 = ticks1.map(tick => tick[0]);
    


        binance.candlesticks("BTCUSDT", "4h", async (error, ticks, symbol) => {
            let last_tick = ticks[ticks.length - 1];
            // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;


            let closes = ticks.map(tick => tick[4]);
            let timestamps = ticks.map(tick => tick[0]);
            

            closes = [...closes1, ...closes];
            timestamps = [...timestamps1, ...timestamps]

            
    
            let stochrsi = await Indicators.StochasticRSI.calculate({values: closes, rsiPeriod: 14, stochasticPeriod: 14, kPeriod:5, dPeriod:2});
            console.log(stochrsi[0])

            
            closes.splice(0, closes.length - stochrsi.length);    


            // stats
            let buyCounter = 0;
            let sellCounter = 0;
            let noTradeCounter = 0;

            let totalBalance = 10000;
            let balanceBTC = 0;
            let balanceUSD = 10000;

            closes.forEach((close, i) => {
                if ( i > 0) {
                    let k = stochrsi[i].k;
                    let d = stochrsi[i].d;

                    let penultK = stochrsi[i - 1].k;
                    let penultD = stochrsi[i - 1].d;

                    if ((k >= d && balanceUSD >= (balanceBTC / 18) * close) 
                    && k < 20 
                    && d < 20) {
                        // buy

                        balanceBTC += (balanceUSD/18) / close;
                        balanceUSD -= (balanceUSD/18);
                        buyCounter++;

                    } else if (k < penultK && penultD < 20 && d < 20 && balanceUSD >= (balanceBTC / 18) * close) {
                        // buy

                        balanceBTC += (balanceUSD/18) / close;
                        balanceUSD -= (balanceUSD/18);
                        buyCounter++;

                    } else if (k < d && k > 80 && d > 80 && balanceBTC > 0) {
                        // sell

                        balanceUSD += (balanceBTC / 18) * close;
                        balanceBTC -= (balanceBTC / 18);

                        sellCounter++
                    } else {
                        // console.log('no trade');
                        noTradeCounter++;

                    }

                    totalBalance = (balanceBTC * close) + balanceUSD;
                }
            })
            
            console.log('\n\n')
            console.log('********** Final Account Balances ***********');
            console.log('Total Balance - $', totalBalance);
            console.log('BTC Balance - ', balanceBTC + ' BTC');
            console.log('USD Balance- $', balanceUSD);
            console.log('Total Balance Increase:', totalBalance - 10000);
            console.log('\n\n');
            console.log('********** Trading Stats ***********');
            console.log('Total Buys - ', buyCounter);
            console.log('Total Sells - ', sellCounter);
            console.log('Total No-Trades', noTradeCounter);


        }, {limit: 1000, endTime: new Date().getTime()});
    },{limit: 1000, endTime: new Date().getTime() - 1000 * 60 * 60 * 4 * 1000})


}

module.exports = backTestTrading;
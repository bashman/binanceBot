const Binance = require('node-binance-us-api');
const Indicators = require('technicalindicators');

const binance = new Binance().options({
  APIKEY: process.env.BOT_API_KEY,
  APISECRET: process.env.BOT_SECRET_KEY
});


let time = new Date().getTime()


const backTestTrading = async () => {

    let ticks2 = [];
    let candles;
    let timeFrame = '2h'

    for (let i=2; i >= 0; i--) {
        candles = await binance.candlesticks("BTCUSDT", timeFrame, null, {limit: 1000, endTime: time - (1000 * 60 * 60 * timeFrame[0] * 1000 * i)});
        ticks2.push(...candles);
    }

    // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;



    let closes = ticks2.map(tick => tick[4]);


    let stochrsi = await Indicators.StochasticRSI.calculate({values: closes, rsiPeriod: 14, stochasticPeriod: 14, kPeriod:5, dPeriod:2});

    
    closes.splice(0, closes.length - stochrsi.length);    


    // stats
    let buyCounter = 0;
    let sellCounter = 0;
    let noTradeCounter = 0;

    
    let startingBalance = 10000
    let totalBalance = startingBalance;
    let balanceBTC = 0;
    let balanceUSD = startingBalance;

    closes.forEach((close, i) => {
        if ( i > 0) {
            let k = stochrsi[i].k;
            let d = stochrsi[i].d;

            let penultK = stochrsi[i - 1].k;
            let penultD = stochrsi[i - 1].d;

            if ((k >= d && balanceUSD > 0) 
            && k < 20 
            && d < 20) {
                // buy

                balanceBTC += (balanceUSD/10) / close;
                balanceUSD -= (balanceUSD/10);
                buyCounter++;

            } else if (k < penultK && penultD < 20 && d < 20 && balanceUSD > 0) {
                // buy

                balanceBTC += (balanceUSD/10) / close;
                balanceUSD -= (balanceUSD/10);
                buyCounter++;

            } else if (k < d && k > 80 && d > 80 && balanceBTC > 0) {
                // sell

                balanceUSD += (balanceBTC / 10) * close;
                balanceBTC -= (balanceBTC / 10);

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
    console.log('Total Balance Increase:', totalBalance - startingBalance);
    console.log('\n\n');
    console.log('********** Trading Stats ***********');
    console.log('Total Buys - ', buyCounter);
    console.log('Total Sells - ', sellCounter);
    console.log('Total No-Trades', noTradeCounter);



}

module.exports = backTestTrading;
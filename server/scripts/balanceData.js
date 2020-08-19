const schedule = require('node-schedule');
const express = require('express');
const axios = require("axios");
const sign = require('../utils/signature');
const uuid = require('uuid');

const accountDB = require('../models/balancesModel');

const { BOT_API_KEY, BOT_SECRET_KEY } = process.env;

const Binance = require('node-binance-us-api');
const binance = new Binance({
  APIKEY: BOT_API_KEY,
  APISECRET: BOT_SECRET_KEY,
});

const balanceData = async () => {
    try {

        let balances = await binance.account();

 
        const { balanceBTC, balanceUSD, assets } = await calcBalance(balances.balances)

        console.log('BALANCEBTC', balanceBTC);
        console.log('BALANCEUSD', balanceUSD);
        console.log('ASSETS', assets);


        await accountDB.create({ uuid: uuid.v1(), balanceBTC, balanceUSD, assets })

    } catch(error) {
        console.log(error)
    }

};



const calcBalance = async (balances) => {
    let balanceBTC = 0;
    let accountCoins = [];


    const  { BTCUSDT: btcPrice} = await binance.prices('BTCUSDT');


    for (const coin of balances) {
        if (coin.free > 0) {
            try {

                let symbol;

                if (coin.asset === 'USDT') {
                    symbol = 'USDT'
                } else if ( coin.asset === 'BTC') {
                    symbol = 'BTCUSDT'
                } else {
                    symbol = `${coin.asset}BTC`
                }

                let price;
                if (symbol !== 'USDT') {
                    price = await binance.prices(symbol);
                }


                if (coin.free > .001) {
                    if (coin.asset === 'USDT') {
                        // usd

                        accountCoins.push({
                            symbol: coin.asset,
                            balanceUSD: coin.free,
                            balanceBTC: coin.free / btcPrice,
                            priceUSD: 1,
                            priceBTC: 1 / btcPrice
                        })

                        balanceBTC += Number(coin.free / btcPrice);
                        
                    } else if (coin.asset !== 'BTC') {
                        // alt coin
                        balanceBTC += price.data.price * coin.free;
    
                        accountCoins.push({
                            symbol: coin.asset,
                            balanceUSD: price.data.price * coin.free * btcPrice,
                            balanceBTC: price.data.price * coin.free,
                            priceUSD: price.data.price * btcPrice,
                            priceBTC: price.data.price
                        })
    
                    } else {
                        // btc
                        balanceBTC += Number(coin.free);

                        accountCoins.push({
                            symbol: coin.asset,
                            balanceUSD: btcPrice * coin.free,
                            balanceBTC: coin.free,
                            priceUSD: btcPrice,
                            priceBTC: 1
                        })
    
                    }
                }

            } catch(error) {
                console.log(error)
            }
        }
    };


    return { balanceBTC: balanceBTC, balanceUSD: balanceBTC * btcPrice, assets: accountCoins };
}

const runScript = () => {
    schedule.scheduleJob('0 */2 * * *', function(){

        balanceData();

      });
}
module.exports = runScript;



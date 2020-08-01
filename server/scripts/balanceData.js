const schedule = require('node-schedule');
const express = require('express');
const axios = require("axios");
const sign = require('../utils/signature');
const uuid = require('uuid');

const accountDB = require('../models/balancesModel');

const { BINANCE_API_KEY } = process.env;


const balanceData = async () => {
    try {
        let date = new Date()


        const requestParams = {
            timestamp: date.getTime()
        };

        const signature = sign(requestParams);

        let response = await axios({
            method:'GET',
            url:`https://api.binance.com/api/v3/account`,
            params:{
                ...requestParams,
                signature,
            },
            headers: {
                "X-MBX-APIKEY": BINANCE_API_KEY
            }
        });

        const { balanceBTC, balanceUSD, assets } = await calcBalance(response.data.balances)


        
        

        console.log('BALANCEBTC', balanceBTC);
        console.log('BALANCEBTC', balanceUSD);
        console.log('ASSETS', assets);


        await accountDB.create({ uuid: uuid.v1(), balanceBTC, balanceUSD, assets })

    } catch(error) {
        console.log(error)
    }

};



const calcBalance = async (balances) => {
    let balanceBTC = 0;
    let accountCoins = [];


    let btcPriceResponse = await axios({
        method:'GET',
        url: 'https://api.binance.com/api/v3/ticker/price',
        params: {
            symbol: `BTCUSDT`
        },
        headers: {
            "X-MBX-APIKEY": BINANCE_API_KEY
        }
    });

    let btcPrice = btcPriceResponse.data.price;


    for (const coin of balances) {
        if (coin.free > 0) {
            try {

                const reqParams =  {
                    symbol: coin.asset === 'BTC' ? 'BTCUSDT' : `${coin.asset}BTC`
                };
                
                let price = await axios({
                    method:'GET',
                    url: 'https://api.binance.com/api/v3/ticker/price',
                    params: {
                        ...reqParams,
                    },
                    headers: {
                        "X-MBX-APIKEY": BINANCE_API_KEY
                    }
                });


                if (coin.asset !== 'BTC') {
                    balanceBTC += price.data.price * coin.free;

                    accountCoins.push({
                        symbol: coin.asset,
                        balanceUSD: price.data.price * coin.free * btcPrice,
                        balanceBTC: price.data.price * coin.free,
                        priceUSD: price.data.price * btcPrice,
                        priceBTC: price.data.price
                    })

                } else {
                    balanceBTC += Number(coin.free);

                    accountCoins.push({
                        symbol: coin.asset,
                        balanceUSD: price.data.price * coin.free,
                        balanceBTC: coin.free,
                        priceUSD: btcPrice,
                        priceBTC: 1
                    })

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



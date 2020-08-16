const Binance = require('node-binance-us-api');
const binance = new Binance().options({
  APIKEY: process.env.BOT_API_KEY,
  APISECRET: process.env.BOT_SECRET_KEY
});

const backTestTrading = () => {
    console.log('hello')
}

module.exports = backTestTrading;
const { default: axios } = require("axios");
const taapi = require("taapi");
const client = taapi.client(process.env.TAAPI_API_KEY);


const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.envBINANCE_SECRET_KEY
});


var Indicators = require('technicalindicators');

var tulind = require('tulind');
const { indicators } = require("tulind");


const getRSIdata = async () => {


}


module.exports = getRSIdata;
const crypto = require('js-sha256')

const { BINANCE_SECRET_KEY } = process.env;

const sign = (params) => {
    let paramsString = '';

    for (key in params) {
        paramsString += `${key}=${params[key]}&`
    }

    paramsString = paramsString.substring(0, paramsString.length - 1);

    console.log(paramsString)

    var signature = crypto.hmac(BINANCE_SECRET_KEY, paramsString);

    return signature;
}

module.exports = sign;
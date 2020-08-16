const crypto = require('js-sha256')

const { BOT_SECRET_KEY } = process.env;

const sign = (params) => {
    let paramsString = '';

    for (key in params) {
        paramsString += `${key}=${params[key]}&`
    }

    paramsString = paramsString.substring(0, paramsString.length - 1);


    var signature = crypto.hmac(BOT_SECRET_KEY, paramsString);

    return signature;
}

module.exports = sign;
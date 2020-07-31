const axios = require("axios");
const crypto = require('js-sha256')


const getAccountData = async() => {

    try {

        let date = new Date()
        let params = `timestamp=${date.getTime()}&symbol=ADABTC`
        


        var signature = crypto.hmac("NLGhblHYTWrQFCr4jGKpqgGSuMa6rskqN2VAxeV64ERt4DXYPFUB5O4GWm4IBaZp", params);
        console.log(signature)

    

        let response = await axios({
            method:'GET',
            url:`https://api.binance.com/api/v3/allOrders?${params}&signature=${signature}`,
            headers: {
                "X-MBX-APIKEY": 'VPkgNODJO6zJ2NDhxuj3rAHUUYKNH8z5onwYS7caTp9Yd0TOKE6U7PKd0UzQuJxS'
            }
        });
    
        console.log(response.data);
    } catch(error) {
        console.log(error)
    }
}


getAccountData();
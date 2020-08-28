const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')

// scripts / modules
const balanceData = require('./scripts/balanceData');
const tradingScript = require('./scripts/trading');
const backTestTrading = require('./scripts/backtest');

if (process.env.NODE_ENV === 'production') {
	balanceData();
	tradingScript();
}

backTestTrading();

// Route includes

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


// router imports
const accountRouter = require('./routes/account.router');
const indicatorRouter = require('./routes/indicator.router');
const userRouter = require('./routes/user.router');


/* Routes */
app.use('/api/account', accountRouter);
app.use('/api/indicator', indicatorRouter);
app.use('/api/user', userRouter);

// Serve static files
app.use(express.static('build'));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(__dirname + '/public'));

	app.get(/.*/, (req,res) => {
		res.sendFile(__dirname + '/public/index.html')
	});
}

// getRSIData();

// App Set //
const PORT = process.env.PORT || 3000;

const dbConnect = async () => {

	try {
	
	
		const connOptions = {
		  useNewUrlParser: true,
		  useUnifiedTopology: true
		};
	  
		await mongoose.connect(`mongodb://thomas123:${process.env.DB_PASSWORD}@binancebotdb-shard-00-00.rntaw.mongodb.net:27017,binancebotdb-shard-00-01.rntaw.mongodb.net:27017,binancebotdb-shard-00-02.rntaw.mongodb.net:27017/binanceBot?replicaSet=atlas-tbrsua-shard-0&ssl=true&authSource=admin`, connOptions);
	
		console.log('DB connected')
		
	  } catch(error) {
		console.log(error);
	  }


}


/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  
  dbConnect();
});
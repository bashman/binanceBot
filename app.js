const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')

// scripts / modules
const balanceData = require('./server/scripts/balanceData');
const tradingScript = require('./server/scripts/trading');
const backTestTrading = require('./server/scripts/backtest');

// Route includes

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


// router imports
const accountRouter = require('./server/routes/account.router');
const indicatorRouter = require('./server/routes/indicator.router');
const userRouter = require('./server/routes/user.router');


/* Routes */
app.use('/api/account', accountRouter);
app.use('/api/indicator', indicatorRouter);
app.use('/api/user', userRouter);

// Serve static files
app.use(express.static('build'));

app.get('/public',(req,res) => {
	res.sendStatus(200);
})

// getRSIData();

// App Set //
const PORT = process.env.PORT || 3000;

const dbConnect = async () => {

	try {
	
	
		const connOptions = {
		  useNewUrlParser: true,
		  useUnifiedTopology: true
		};
	  
		await mongoose.connect('mongodb://thomas123:Snickerdoodle37@binancebotdb-shard-00-00.rntaw.mongodb.net:27017,binancebotdb-shard-00-01.rntaw.mongodb.net:27017,binancebotdb-shard-00-02.rntaw.mongodb.net:27017/binanceBot?replicaSet=atlas-tbrsua-shard-0&ssl=true&authSource=admin', connOptions);
	
		console.log('DB connected')
		
		balanceData();
		tradingScript();
		backTestTrading();
	
	  } catch(error) {
		console.log(error);
	  }


}


/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  
  dbConnect();
});
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')

const balanceData = require('./server/scripts/balanceData');

// Route includes

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// router imports
const userRouter = require('./server/routes/balance.router')

app.use(cors())

/* Routes */
app.use('/api/user', userRouter);
// app.use('/sms', smsRouter);
// app.use('/cards', cardsRouter)

// Serve static files
app.use(express.static('build'));

app.get('/public',(req,res) => {
	res.sendStatus(200);
})

// App Set //
const PORT = process.env.PORT || 3000;

const dbConnect = async () => {

	try {

		balanceData();
	
	
		const connOptions = {
		  useNewUrlParser: true,
		  useUnifiedTopology: true
		};
	  
		await mongoose.connect('mongodb://thomas123:Snickerdoodle37@binancebotdb-shard-00-00.rntaw.mongodb.net:27017,binancebotdb-shard-00-01.rntaw.mongodb.net:27017,binancebotdb-shard-00-02.rntaw.mongodb.net:27017/binanceBot?replicaSet=atlas-tbrsua-shard-0&ssl=true&authSource=admin', connOptions);
	
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
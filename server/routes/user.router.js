const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

//db
const userDB = require('../models/userModel');


router.post('/register', async (req,res) => {
	try {

		//hash
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		let user = await userDB.create({uuid: uuid.v1(), username: req.body.username, password: hashPassword});

		res.send(user);
	} catch(error) {
		console.log(error)
		res.sendStatus(400)
	}
});

router.post('/login', async (req,res) => {
	try {

		const user = await userDB.findOne({ username: req.body.username });

		if (!user) return res.status(400).send('Username does not exist.');

		const validPass = await bcrypt.compare(req.body.password, user.password);

		if (!validPass) return res.status(400).send('Password is invalid');

		const token = jwt.sign({ uuid: user.uuid }, process.env.TOKEN_SECRET);

		res.header('authToken', token).send(token);
	} catch(error) {
		console.log(error);
		res.sendStatus(400);
	}
})





module.exports = router;
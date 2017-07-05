const express = require('express');
const jwt = require('jwt-simple');
const authMW = require('./middleware');
const users = require('./data');
const bodyParser = require('body-parser');
const app = express();

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const CONFIG = { secret:'superultrasecret' };
let userInDB = { user:'zetogk', email:'zetogk@gmail.com', password:'12345', public_name:'ZE67sjdGK' };

/* FOR NO AUTH*/
app.get('/users-no-auth', (req, res) => {
	res.status(200).json({message:'ok', user:req.public_name, users:users});
})

app.get('/users-no-auth/:n', (req, res) => {
	let n = (req.params.n)-1;
	if (n < users.length) { res.status(200).json({message:'ok', user:users[n]}); }
	else { res.status(200).json({message:'error', detail:'not found'}); }
});

app.post('/users-no-auth/', (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been added'});
});

app.put('/users-no-auth/:n', (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been updated'});
});

app.patch('/users-no-auth/:n', (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been updated with the method patch'});
});

app.delete('/users-no-auth/:n', (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been deleted'});
});
/* FOR NO AUTH*/

/* FOR BASIC*/
app.get('/users-basic-auth', authMW.basicAuth, (req, res) => {
	res.status(200).json({message:'ok', user:req.public_name, users:users});
})

app.get('/users-basic-auth/:n', authMW.basicAuth, (req, res) => {
	let n = (req.params.n)-1;
	if (n < users.length) { res.status(200).json({message:'ok', user:users[n]}); }
	else { res.status(200).json({message:'error', detail:'not found'}); }
});

app.post('/users-basic-auth/', authMW.basicAuth, (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been added'});
});

app.put('/users-basic-auth/:n', authMW.basicAuth, (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been updated'});
});

app.patch('/users-basic-auth/:n', authMW.basicAuth, (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been updated with the method patch'});
});

app.delete('/users-basic-auth/:n', authMW.basicAuth, (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been deleted'});	
});
/* FOR BASIC*/

/* FOR JWT*/
app.post('/login-jwt', (req, res) => {
	let data = req.body;
	if((data.user==userInDB.user || data.email==userInDB.email) && data.password==userInDB.password){
		let payload = { public_name: userInDB.public_name };
		let token = jwt.encode(payload, CONFIG.secret, 'HS256');
		res.status(200).json({message:'ok', token});
	}else{
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
		res.status(401).json({message:'error', detail:'credentials are invalid'});
	}
})

app.get('/users-jwt', authMW.JWTAuth, (req, res) => {
	res.status(200).json({message:'ok', user:req.public_name, users:users});
})

app.get('/users-jwt/:n', authMW.JWTAuth, (req, res) => {
	let n = (req.params.n)-1;
	if (n < users.length) { res.status(200).json({message:'ok', user:users[n]}); }
	else { res.status(200).json({message:'error', detail:'not found'}); }
});

app.post('/users-jwt/', authMW.JWTAuth, (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been added'});
});

app.put('/users-jwt/:n', authMW.JWTAuth, (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been updated'});
});

app.patch('/users-jwt/:n', authMW.JWTAuth, (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been updated with the method patch'});
});

app.delete('/users-jwt/:n', authMW.JWTAuth, (req, res) => {
	res.status(200).json({message:'ok', detail:'The user has been deleted'});
});
/* FOR JWT*/



console.log('APP ON: '+app.get('port'));
app.listen(app.get('port'));
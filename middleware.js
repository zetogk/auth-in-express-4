const jwt = require('jwt-simple');

const CONFIG = { secret:'superultrasecret' };
let userInDB={ user:'zetogk', password:'12345', public_name:'ZE67sjdGK' };
let authMW={};

authMW.JWTAuth = (req, res, next) => { 
	let auth = req.headers['authorization'];
	if(!auth) {
		res.setHeader('WWW-Authenticate', 'Bearer realm="Secure Area"');
		res.status(401).json({message:'error', detail:'Auth is required'});
	} else {
		let tipoAuth = auth.split(' ')[0]; //Bearer
		if(tipoAuth == 'Bearer'){
			let token = auth.split(' ')[1];
			let decoded;

			try	{
				decoded = jwt.decode(token, CONFIG.secret);
			}catch(e){
				console.log(e);
				res.setHeader('WWW-Authenticate', 'Bearer realm="Secure Area"');
				res.status(401).json({message:'error', detail:'signature verification failed'});
				return;
			}

			req.public_name= decoded.public_name;
			next();

		} else {
			res.setHeader('WWW-Authenticate', 'Bearer realm="Secure Area"');
			res.status('401').json({message:'error', detail:'Auth should be: Bearer'});
		} //END ELSE tipoAuth=='Bearer'
	}
};

authMW.basicAuth = (req, res, next) => {
	
};

module.exports = authMW;
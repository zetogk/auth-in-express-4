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
		if(tipoAuth == 'Bearer' || tipoAuth == 'bearer' || tipoAuth == 'BEARER'){
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
			res.status('401').json({message:'error', detail:'Auth should be: Bearer, bearer or BEARER'});
		} //END ELSE tipoAuth=='Bearer'
	}
};

authMW.basicAuth = (req, res, next) => {
	let auth = req.headers['authorization'];
	if(!auth) {
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
		res.status(401).json({message:'error', detail:'Auth is required'});
	}
	else{
		let tipoAuth = auth.split(' ')[0]; //Basic
		if(tipoAuth == 'Basic' || tipoAuth == 'basic' || tipoAuth == 'BASIC'){
			let tmpBuffer = new Buffer(auth.split(' ')[1], 'base64');
			let datosAuth = tmpBuffer.toString(); // usuario:contraseña
			let credenciales = datosAuth.split(':');
			let usuario = credenciales[0];
			let contrasena = credenciales[1];
			if(usuario=='zetogk' && contrasena=='12345'){
				console.log('Auth OK');
				next();
			}else{
				res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
				res.status('401').json({message:'error', detail:'credentials are invalid'});
			}
		} else {
			res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
			res.status('401').json({message:'error', detail:'Auth should be: Basic, basic or BASIC'});
		}
	}
};

module.exports = authMW;
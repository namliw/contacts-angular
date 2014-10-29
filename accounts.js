var express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	Bourne = require('bourne'),
	crypto = require('crypto');

var router = express.Router(),
db = new Bourne('users.json');

function hash(password){
	return crypto.createHash('sha256').update(password).digest('hex');
}

router
	.use(bodyParser.urlencoded())
	.use(bodyParser.json())
	.use(session({secret:'1lk23jn1lkj23n1kl2j3n1l2j3kn1lkj2n3kj12n31kj'}))
	.get('/login',function(req,res){
		res.sendfile('public/login.html');
	})
	.post('/login',function(req,res){
		console.log('login');
		var user = {
			username: req.body.username,
			password: hash(req.body.password)
		};
		db.findOne(user, function(err,data){
			if(data){
				req.session.userId = data.id;
				res.redirect('/');
			}else{
				res.redirect('/login');
			}
		});
	})
	.post('/register',function(req,res){
		console.log('register');
		var user = {
			username: req.body.username,
			password: hash(req.body.password),
			id:new Date().getTime(),
			option: {}
		};

		db.find({username:user.username},function(err,data){
			if(!data.length){
				db.insert(user,function(err,data){
					req.session.userId = data.id;
					res.redirect('/');
				});
			} else {
				res.redirect('/login');
			}
		});

	})
	.get('/logout',function(req,res){
		req.session.userId = null;
		res.redirect('/');
	})
	.use(function(req,res,next){
		console.log('checking for user registered',req.session.userId)
		if(req.session.userId){
			db.findOne({id:req.session.userId},function(err,data){
				req.user = data;
				console.log('user found',req.user,data)
			});
		}
		next();
	});

module.exports = router;
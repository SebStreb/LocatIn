var passport = require('passport');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log(req.session.passport);
	res.render('index', {title: 'Index'});
});

router.get('/login', function(req, res) {
	console.log(req.session.passport);
	res.render('login', {title: 'Login'});
});

router.post('/login', passport.authenticate('local',
		{ successRedirect: '/',
			failureRedirect: '/login',
		}
	)
);

module.exports = router;

var passport = require('passport');
var express = require('express');
var router = express.Router();

var user = require('../database/user.js');

router.use(function (req, res, next) {
	console.log(req.session.passport);
	next();
});

router.get('/', function(req, res) {
	if (req.session.passport) {
		res.render('index', {title: 'Index', rel: 'Home', user: req.session.passport.user});
	} else {
		res.render('index', {title: 'Index', rel: 'Home'});
	}
});

router.get('/about', function(req, res) {
	if (req.session.passport) {
		res.render('about', {title: 'About', rel: 'About', user: req.session.passport.user});
	} else {
		res.render('about', {title: 'About', rel: 'About'});
	}
});

router.get('/login', function(req, res) {
	if (req.session.passport) {
		res.render('login', {title: 'Login', rel: 'Login', user: req.session.passport.user});
	} else {
		res.render('login', {title: 'Login', rel: 'Login'});
	}
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

router.post('/login', passport.authenticate('local',
		{ successRedirect: '/',
			failureRedirect: '/login',
		}
	)
);

module.exports = router;

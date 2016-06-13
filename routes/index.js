var passport = require('passport');
var express = require('express');
var router = express.Router();

var user = require('../database/user.js');

router.use(function (req, res, next) {
	if (req.session.passport) {
		if (!req.session.passport.user)
			console.log("User : disconnected");
		else
			console.log("USER : " + req.session.passport.user);
	} else
		console.log("USER : not connected");
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

router.get('/report', function (req, res) {
	res.sendfile('/public/report/index.html');
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

router.post('/login', function (req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);
		if (!user)
			return res.render('login', {title: 'Login', rel: 'Login', message: info.message});
		req.logIn(user, function(err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	})(req, res, next);
});

module.exports = router;

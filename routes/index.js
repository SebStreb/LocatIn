var passport = require('passport');
var express = require('express');
var router = express.Router();

var user = require('../database/user.js');

router.get('/', function(req, res) {
	console.log(req.session.passport);
	if (req.session.passport) {
		res.render('index', {title: 'Index', rel: 'Home', user: req.session.passport.user});
	} else {
		res.render('index', {title: 'Index', rel: 'Home'});
	}
});

router.get('/about', function(req, res) {
	console.log(req.session.passport);
	if (req.session.passport) {
		res.render('about', {title: 'About', rel: 'About', user: req.session.passport.user});
	} else {
		res.render('about', {title: 'About', rel: 'About'});
	}
});

router.get('/login', function(req, res) {
	console.log(req.session.passport);
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

router.get('/exec', function (req, res) {
	if (req.session.passport.user != 'admin') {
		res.redirect('/');
	} else {
		res.render('exec', {title: 'SQL', rel: 'Management', user: req.session.passport.user});
	}
});

router.post('/exec', function (req, res) {
	if (req.session.passport.user != 'admin') {
		res.redirect('/');
	} else {
		user.exec(req.body.sql, function (results, fields, err) {
			res.render('exec', {title: 'SQL', results: results, fields: fields, err: err, rel: 'Management', user: req.session.passport.user});
		});
	}
})

module.exports = router;

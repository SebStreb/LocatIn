var express = require('express');
var router = express.Router();
var queries = require('../database/queries.js');

router.use(function (req, res, next) {
	if (req.session.passport) {
		if (!req.session.passport.user)
			res.redirect('/');
		else
			next();
	} else
		res.redirect('/');
});

router.get('/', function(req, res) {
	console.log(req.session.passport);
	res.render('reports/index', {title: 'Reports', rel: 'Reports', user: req.session.passport.user});
});

router.get('/catalog', function (req, res) {
	console.log(req.session.passport);
	queries.getCatalog(function (results, fields) {
		res.render('reports/report', {title: 'Catalog', name: 'Catalog', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

router.get('/supply', function(req, res) {
	console.log(req.session.passport);
	queries.getSupply(function (results, fields) {
		res.render('reports/report', {title: 'Supply', name: 'Supply of cars', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

router.get('/reservations', function(req, res) {
	console.log(req.session.passport);
	queries.getRes(function (results, fields) {
		res.render('reports/report', {title: 'Reservations', name: 'Reserved cars', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

router.get('/locations', function(req, res) {
	console.log(req.session.passport);
	queries.getLoc(function (results, fields) {
		res.render('reports/report', {title: 'Locations', name: 'Cars in location', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

router.get('/history', function(req, res) {
	console.log(req.session.passport);
	queries.getHist(function (results, fields) {
		res.render('reports/report', {title: 'History', name: 'History', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

module.exports = router;

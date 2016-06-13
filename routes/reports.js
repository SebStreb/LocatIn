var express = require('express');
var router = express.Router();
var queries = require('../database/queries.js');

router.use(function (req, res, next) {
	if (req.session.passport) {
		if (!req.session.passport.user) {
			res.status(401);
			res.render('401', {title: '401', rel: 'Reports'});
		} else next();
	} else {
		res.status(401);
		res.render('401', {title: '401', rel: 'Reports'});
	}
});

router.get('/catalog', function (req, res) {
	queries.getCatalog(function (results, fields) {
		res.render('reports/report', {title: 'Catalog', name: 'Catalog', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

router.get('/supply', function(req, res) {
	queries.getSupply(function (results, fields) {
		res.render('reports/report', {title: 'Supply', name: 'Supply of cars', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

router.get('/reservations', function(req, res) {
	queries.getRes(function (results, fields) {
		res.render('reports/report', {title: 'Reservations', name: 'Reserved cars', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

router.get('/locations', function(req, res) {
	queries.getLoc(function (results, fields) {
		res.render('reports/report', {title: 'Locations', name: 'Cars in location', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

router.get('/history', function(req, res) {
	queries.getHist(function (results, fields) {
		res.render('reports/report', {title: 'History', name: 'History', rel: 'Reports', user: req.session.passport.user, fields: fields, results: results});
	});
});

module.exports = router;

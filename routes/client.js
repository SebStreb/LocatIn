var express = require('express');
var router = express.Router();

var client = require('../database/tables/client.js');
var formule = require('../database/tables/formule.js');
var modele = require('../database/tables/modele.js');
var option = require('../database/tables/option.js');

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
	res.render('client/index', {title: 'Client', rel: 'Client', user: req.session.passport.user});
});

router.get('/inscription', function(req, res) {
	console.log(req.session.passport);
	res.render('client/inscription', {title: 'Inscription', rel: 'Client', user: req.session.passport.user});
});

router.post('/inscription', function (req, res) {
	console.log(req.session.passport);
	client.insert({prenom: req.body.prenom, nom: req.body.nom});
	res.redirect('/client/inscription');
});

router.get('/reservation', function(req, res) {
	console.log(req.session.passport);
	client.getAll(function (result1) {
		modele.getAll(function (result2) {
			option.getAll(function (result3) {
				formule.getAll(function (result4) {
					res.render('client/reservation-1', {title: 'Reservation', result1: result1, result2: result2, result3: result3, result4: result4, rel: 'Client', user: req.session.passport.user});
				});
			});
		});
	});
});

module.exports = router;

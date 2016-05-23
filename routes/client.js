var express = require('express');
var router = express.Router();

var client = require('../database/tables/client.js');
var formule = require('../database/tables/formule.js');
var modele = require('../database/tables/modele.js');
var option = require('../database/tables/option.js');
var reservation = require('../database/tables/reservation.js');
var location = require('../database/tables/location.js');
var reception = require('../database/tables/reception.js');
var vehicule = require('../database/tables/vehicule.js');
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

router.get('/reservation-2', function (req, res) {
	console.log(req.session.passport);
	res.redirect('/client/reservation');
});

router.post('/reservation-2', function (req, res) {
	console.log(req.session.passport);
	var initDate = new Date(req.body.departure);
	var returnDate = new Date();
	if (req.body.formule == 'Journée')
		returnDate.setDate(initDate.getDate() + 1);
	else if (req.body.formule == 'Semaine')
		returnDate.setDate(initDate.getDate() + 7);
	else
		returnDate.setDate(initDate.getDate() + 3);
	queries.getProposition(returnDate, req.body.modele, req.body.option, function (result, field) {
		res.render('client/reservation-2', {title: 'Reservation', client: req.body.client, formule: req.body.formule, depart: initDate, results: result, fields: field, rel: 'Client', user: req.session.passport.user});
	});
});

router.get('/reservation-3', function (req, res) {
	console.log(req.session.passport);
	res.redirect('/client/reservation');
});

router.post('/reservation-3', function (req, res) {
	console.log(req.session.passport);
	vehicule.getOne(req.body.vehicule, function (vehiculeId) {
		reservation.insert({formuleType: req.body.formule, vehiculeNumero: vehiculeId, clientId: req.body.client, etat: 'Effectif', dateAnnulation: null, nouvelleReservationNumero: null});
		res.redirect('/');
	});
});

router.get('/departure', function (req, res) {
	console.log(req.session.passport);
	res.render('client/departure', {title: 'Departure', rel: 'Client', user: req.session.passport.user});
});

router.get('/departure-1', function (req, res) {
	console.log(req.session.passport);
	res.redirect('/client/departure');
});

router.post('/departure-1', function (req, res) {
	console.log(req.session.passport);
	location.insert({reservationNumero: req.body.num, kilometrageDepart: req.body.kil, dateDepart: new Date(), paiementCaution: req.body.caution == 'paid'});
	res.redirect('/');
});

router.get('/departure-2', function (req, res) {
	console.log(req.session.passport);
	res.redirect('/client/departure');
});

router.post('/departure-2', function (req, res) {
	console.log(req.session.passport);
	reservation.update({numero: req.body.num}, {etat: 'Annulée', nouvelleReservationNumero: req.body.new});
	res.redirect('/');
});

router.get('/departure-3', function (req, res) {
	console.log(req.session.passport);
	res.redirect('/client/departure');
});

router.post('/departure-3', function (req, res) {
	console.log(req.session.passport);
	reservation.suppr(req.body.num);
	res.redirect('/');
});

router.get('/return', function (req, res) {
	console.log(req.session.passport);
	res.render('client/return', {title: 'Return', rel: 'Client', user: req.session.passport.user});
});

router.post('/return', function (req, res) {
	console.log(req.session.passport);
	reception.insert({locationNumeroContrat: req.body.contrat, kilometrageArrivee: req.body.kil, dateArrivee: new Date()});
	location.endRes(req.body.contrat);
	res.redirect('/');
});

router.get('/payment', function (req, res) {
	console.log(req.session.passport);
	client.getAll(function (clients) {
		res.render('client/payment', {title: 'Payment', clients: clients, rel: 'Client', user: req.session.passport.user});
	});
});

router.post('/payment', function (req, res) {
	console.log(req.session.passport);
	client.getAll(function (clients) {
		queries.getFact(req.body.client, function (results, fields) {
			res.render('client/payment', {title: 'Payment', clients: clients, results: results, fields: fields, rel: 'Client', user: req.session.passport.user});
		});
	});
});

router.get('/fidelity', function (req, res) {
	console.log(req.session.passport);
	client.getAll(function (clients) {
		res.render('client/fidelity', {title: 'Fidelity', clients: clients, rel: 'Client', user: req.session.passport.user});
	});
});

router.post('/fidelity', function (req, res) {
	console.log(req.session.passport);
	client.getAll(function (clients) {
		queries.getFid(req.body.client, function (results, fields) {
			res.render('client/fidelity', {title: 'Fidelity', clients: clients, results: results, fields: fields, rel: 'Client', user: req.session.passport.user});
		});
	});
});

module.exports = router;

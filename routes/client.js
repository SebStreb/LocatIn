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
var facture = require('../database/tables/facture.js');
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
	res.render('client/index', {title: 'Client', rel: 'Client', user: req.session.passport.user});
});

router.get('/inscription', function(req, res) {
	res.render('client/inscription', {title: 'Inscription', rel: 'Client', user: req.session.passport.user});
});

router.post('/inscription', function (req, res) {
	client.insert({prenom: req.body.prenom, nom: req.body.nom}, function (result) {
		result.title = 'Result';
		result.rel = 'Client';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.get('/reservation', function(req, res) {
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
	res.redirect('/client/reservation');
});

router.post('/reservation-2', function (req, res) {
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
	res.redirect('/client/reservation');
});

router.post('/reservation-3', function (req, res) {
	vehicule.getOne(req.body.vehicule, function (vehiculeId) {
		reservation.insert({formuleType: req.body.formule, vehiculeNumero: vehiculeId, clientId: req.body.client, etat: 'Effectif', dateAnnulation: null, nouvelleReservationNumero: null}, function (result) {
			result.title = 'Result';
			result.rel = 'Client';
			result.user = req.session.passport.user;
			res.render('result', result);
		});
	});
});

router.get('/departure', function (req, res) {
	res.render('client/departure', {title: 'Departure', rel: 'Client', user: req.session.passport.user});
});

router.get('/departure-1', function (req, res) {
	res.redirect('/client/departure');
});

router.post('/departure-1', function (req, res) {
	location.insert({reservationNumero: req.body.num, kilometrageDepart: req.body.kil, dateDepart: new Date(), paiementCaution: req.body.caution == 'paid'}, function (result) {
		result.title = 'Result';
		result.rel = 'Client';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.get('/departure-2', function (req, res) {
	res.redirect('/client/departure');
});

router.post('/departure-2', function (req, res) {
	reservation.update({numero: req.body.num}, {etat: 'Annulée', nouvelleReservationNumero: req.body.new}, function (result) {
		result.title = 'Result';
		result.rel = 'Client';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.get('/departure-3', function (req, res) {
	res.redirect('/client/departure');
});

router.post('/departure-3', function (req, res) {
	reservation.suppr(req.body.num, function (result) {
		result.title = 'Result';
		result.rel = 'Client';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.get('/return', function (req, res) {
	res.render('client/return', {title: 'Return', rel: 'Client', user: req.session.passport.user});
});

router.post('/return', function (req, res) {
	reception.insert({locationNumeroContrat: req.body.contrat, kilometrageArrivee: req.body.kil, dateArrivee: new Date()}, function () {
		location.endRes(req.body.contrat, function (result) {
			result.title = 'Result';
			result.rel = 'Client';
			result.user = req.session.passport.user;
			res.render('result', result);
		});
	});
});

router.get('/payment', function (req, res) {
	client.getAll(function (clients) {
		res.render('client/payment', {title: 'Payment', clients: clients, rel: 'Client', user: req.session.passport.user});
	});
});

router.post('/payment', function (req, res) {
	client.getAll(function (clients) {
		queries.getFact(req.body.client, function (results, fields) {
			res.render('client/payment', {title: 'Payment', clients: clients, results: results, fields: fields, rel: 'Client', user: req.session.passport.user});
		});
	});
});

router.get('/payment-2', function (req, res) {
	res.redirect('/client/payment');
});

router.post('/payment-2', function (req, res) {
	facture.setPaid(req.body.pay, function (result) {
		result.title = 'Result';
		result.rel = 'Client';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.get('/fidelity', function (req, res) {
	client.getAll(function (clients) {
		res.render('client/fidelity', {title: 'Fidelity', clients: clients, rel: 'Client', user: req.session.passport.user});
	});
});

router.post('/fidelity', function (req, res) {
	client.getAll(function (clients) {
		queries.getFid(req.body.client, function (results, fields) {
			res.render('client/fidelity', {title: 'Fidelity', clients: clients, results: results, fields: fields, rel: 'Client', user: req.session.passport.user});
		});
	});
});

module.exports = router;

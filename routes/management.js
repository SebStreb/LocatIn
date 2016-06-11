var express = require('express');
var router = express.Router();

var vehicule = require('../database/tables/vehicule.js');
var modele = require('../database/tables/modele.js');
var option = require('../database/tables/option.js');
var tarification = require('../database/tables/tarification.js');
var montant = require('../database/tables/montant.js');
var user = require('../database/user.js');

router.use(function (req, res, next) {
	if (req.session.passport) {
		if (!req.session.passport.user)
			res.redirect('/');
		else
			next();
	} else
		res.redirect('/');
});

router.get('/vehicule', function (req, res) {
	modele.getAll(function (results) {
		res.render('management/vehicule', {title: 'Vehicule', results: results, rel: 'Management', user: req.session.passport.user});
	});
});

router.post('/vehicule', function (req, res) {
	var marque = req.body.model.split(" ")[0];
	var type = req.body.model.split(" ")[1];
	vehicule.insert({modeleMarque: marque, modeleType: type}, function (result) {
		result.title = 'Result';
		result.rel = 'Management';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.get('/vehicule-2', function (req, res) {
	option.getAll(function (results1) {
		tarification.getAll(function (results2) {
			res.render('management/vehicule-2', {title: 'Vehicule', results1: results1, results2: results2, rel: 'Management', user: req.session.passport.user});
		});
	});
});

router.post('/vehicule-2', function (req, res) {
	modele.insert({marque: req.body.marque, type: req.body.type, optionCode: req.body.option, tarificationCode: req.body.tarification}, function () {
		vehicule.insert({modeleMarque: req.body.marque, modeleType: req.body.type}, function (result) {
			result.title = 'Result';
			result.rel = 'Management';
			result.user = req.session.passport.user;
			res.render('result', result);
		});
	});
});

router.get('/prices', function (req, res) {
	tarification.getPrixKil(function (result1) {
		tarification.getPrixJour(function (result2) {
			montant.getPrice(function (result3) {
				res.render('management/prices', {title: 'Prices', result1: result1, result2: result2, result3: result3, rel: 'Management', user: req.session.passport.user});
			});
		});
	});
});

router.post('/prices-1', function (req, res) {
	tarification.setKil(req.body.select, req.body.value, function (result) {
		result.title = 'Result';
		result.rel = 'Management';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.post('/prices-2', function (req, res) {
	tarification.setJour(req.body.select, req.body.value, function (result) {
		result.title = 'Result';
		result.rel = 'Management';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.post('/prices-3', function (req, res) {
	console.log("!!!!!!" + req.body.select);
	var tar = req.body.select.split(" ")[0];
	var form = req.body.select.split(" ")[1];
	console.log(tar + form);
	montant.setMontant(tar, form, req.body.value, function (result) {
		result.title = 'Result';
		result.rel = 'Management';
		result.user = req.session.passport.user;
		res.render('result', result);
	});
});

router.get('/exec', function (req, res) {
	if (req.session.passport.user != 'admin') {
		res.redirect('/');
	} else {
		res.render('management/exec', {title: 'SQL', sql: '', rel: 'Management', user: req.session.passport.user});
	}
});

router.post('/exec', function (req, res) {
	if (req.session.passport.user != 'admin') {
		res.redirect('/');
	} else {
		user.exec(req.body.sql, function (results, fields, err) {
			res.render('management/exec', {title: 'SQL', sql: req.body.sql, results: results, fields: fields, err: err, rel: 'Management', user: req.session.passport.user});
		});
	}
});

module.exports = router;

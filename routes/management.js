var express = require('express');
var router = express.Router();

var vehicule = require('../database/tables/vehicule.js');
var modele = require('../database/tables/modele.js');
var option = require('../database/tables/option.js');
var tarification = require('../database/tables/tarification.js');

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
	res.render('management/index', {title: 'Management', rel: 'Management', user: req.session.passport.user});
});

router.get('/vehicule', function (req, res) {
	console.log(req.session.passport);
	modele.getAll(function (results) {
		res.render('management/vehicule', {title: 'Vehicule', results: results, rel: 'Management', user: req.session.passport.user});
	});
});

router.post('/vehicule', function (req, res) {
	console.log(req.session.passport);
	var marque = req.body.model.split(" ")[0];
	var type = req.body.model.split(" ")[1];
	vehicule.insert({modeleMarque: marque, modeleType: type});
	res.redirect('/');
});

router.get('/vehicule-2', function (req, res) {
	console.log(req.session.passport);
	option.getAll(function (results1) {
		tarification.getAll(function (results2) {
			res.render('management/vehicule-2', {title: 'Vehicule', results1: results1, results2: results2, rel: 'Management', user: req.session.passport.user});
		});
	});
});

router.post('/vehicule-2', function (req, res) {
	console.log(req.session.passport);
	modele.insert({marque: req.body.marque, type: req.body.type, optionCode: req.body.option, tarificationCode: req.body.tarification});
	vehicule.insert({modeleMarque: req.body.marque, modeleType: req.body.type});
	res.redirect('/');
});

module.exports = router;

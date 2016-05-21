'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Assureur( \n" +
			"prenom VARCHAR(20) NOT NULL, \n" +
			"nom VARCHAR(20) NOT NULL, \n" +
			"adresse VARCHAR(60), \n" +
			"telephone VARCHAR(10), \n" +
			"fax VARCHAR(10), \n" +
			"PRIMARY KEY(prenom, nom) \n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE ASSUREUR : ' + err.message);
		});
	});
};

exports.insert = function (assureur) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO Assureur(prenom, nom) \n" +
		"VALUES(:prenom, :nom)";
		connection.query(sql, assureur, function (err, result, field) {
			if (err) console.error('INSERT ASSUREUR : ' + err.message);
			console.log('INSERTED IN ASSUREUR');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Assureur";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY ASSUREUR : ' + err.message);
		});
	});
};

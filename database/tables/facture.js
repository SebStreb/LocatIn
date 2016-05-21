'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Facture(\n" +
			"numero INT PRIMARY KEY AUTO_INCREMENT NOT NULL,\n" +
			"locationNumeroContrat INT,\n" +
			"FOREIGN KEY (locationNumeroContrat) REFERENCES Location(numeroContrat)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE FACTURE : ' + err.message);
		});
	});
};

exports.insert = function (facture) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO Facture(locationNumeroContrat)\n" +
		"VALUES(:locationNumeroContrat)";
		connection.query(sql, facture, function (err, result) {
			if (err) console.error('INSERT FACTURE : ' + err.message);
			console.log('INSERTED ID ' + result.insertId + ' IN FACTURE');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Facture";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY FACTURE : ' + err.message);
		});
	});
};

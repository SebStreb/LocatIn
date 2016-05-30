'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Facture(\n" +
			"numero INT PRIMARY KEY AUTO_INCREMENT NOT NULL,\n" +
			"locationNumeroContrat INT,\n" +
			"etat VARCHAR(20) DEFAULT 'non-payé',\n" +
			"FOREIGN KEY (locationNumeroContrat) REFERENCES Location(numeroContrat)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE FACTURE : ' + err.message);
		});
	});
};

exports.setPaid = function (numero, callback) {
	mysql(function (connection) {
		var sql =
		"UPDATE Facture SET etat = 'payé' WHERE numero = " + numero;
		connection.query(sql, function (err, result) {
			if (err) console.error('SET PAID : ' + err.message);
			callback({err: err, insert: false, table: 'Facture', rows: result.affectedRows});
		});
	});
};

exports.insert = function (facture, callback) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO Facture(locationNumeroContrat)\n" +
		"VALUES(:locationNumeroContrat)";
		connection.query(sql, facture, function (err, result) {
			if (err) console.error('INSERT FACTURE : ' + err.message);
			console.log('INSERTED ID ' + result.insertId + ' IN FACTURE');
			callback({err: err, insert: true, table: 'Facture', ID: result.insertId});
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

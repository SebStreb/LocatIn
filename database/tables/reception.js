'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Reception(\n" +
			"locationNumeroContrat INT PRIMARY KEY NOT NULL,\n" +
			"kilometrageArrivee FLOAT NOT NULL,\n" +
			"dateArrivee DATETIME DEFAULT NOW(),\n" +
			"dommage VARCHAR(50),\n" +
			"FOREIGN KEY (locationNumeroContrat) REFERENCES Location(numeroContrat),\n" +
			"CHECK (kilometrageArrivee > 0)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE RECEPTION : ' + err.message);
		});
	});
};

exports.insert = function (assureur) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO\n" +
		"Reception(locationNumeroContrat, kilometrageArrivee, dateArrivee)\n" +
		"VALUES(:locationNumeroContrat, :kilometrageArrivee, :dateArrivee)";
		connection.query(sql, assureur, function (err, result) {
			if (err) console.error('INSERT RECEPTION : ' + err.message);
			console.log('INSERTED IN RECEPTION');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Reception";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY RECEPTION : ' + err.message);
		});
	});
};

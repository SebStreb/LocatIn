'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Montant(\n" +
			"tarificationCode CHAR(2) NOT NULL,\n" +
			"formuleType VARCHAR(20) NOT NULL,\n" +
			"montantForfaitaire FLOAT NOT NULL,\n" +
			"PRIMARY KEY (tarificationCode, formuleType),\n" +
			"FOREIGN KEY (tarificationCode) REFERENCES Tarification(code),\n" +
			"FOREIGN KEY (formuleType) REFERENCES Formule(type),\n" +
			"CHECK (montantForfaitaire > 0)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE MONTANT : ' + err.message);
		});
	});
};

exports.insert = function (montant) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO\n" +
		"Montant(tarificationCode, formuleType, montantForfaitaire)\n" +
		"VALUES(:tarificationCode, :formuleType, :montantForfaitaire)";
		connection.query(sql, montant, function (err, result) {
			if (err) console.error('INSERT MONTANT : ' + err.message);
			console.log('INSERTED IN MONTANT');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Montant";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY MONTANT : ' + err.message);
		});
	});
};

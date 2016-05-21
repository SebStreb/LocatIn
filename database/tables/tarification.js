'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Tarification( \n" +
			"code CHAR(2) PRIMARY KEY NOT NULL, \n" +
			"assuranceType VARCHAR(20) NOT NULL, \n" +
			"prixKilometre FLOAT NOT NULL, \n" +
			"amendeJournaliere FLOAT NOT NULL, \n" +
			"FOREIGN KEY (assuranceType) REFERENCES Assurance(type), \n" +
			"CHECK (prixKilometre > 0), \n" +
			"CHECK (amendeJournaliere > 0) \n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE TARIFICATION : ' + err.message);
		});
	});
};

exports.insert = function (tarification) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO \n" +
		"Tarification(code, assuranceType, prixKilometre, amendeJournaliere) \n" +
		"VALUES(:code, :assuranceType, :prixKilometre, :amendeJournaliere) ";
		connection.query(sql, tarification, function (err, result) {
			if (err) console.error('INSERT TARIFICATION : ' + err.message);
			console.log('INSERTED IN TARIFICATION');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Tarification";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY TARIFICATION : ' + err.message);
		});
	});
};

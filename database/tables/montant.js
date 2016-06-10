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

exports.getPrice = function (callback) {
	mysql(function (connection) {
		var sql =
		"SELECT tarificationCode AS 'Code', formuleType AS 'Formule',\n" +
			"montantForfaitaire AS 'Montant' FROM Montant";
		connection.query(sql, function (err, result) {
			if (err) console.error('GET MONTANT PRICES : ' + err.message);
			callback(result)
		});
	});
};

exports.setMontant = function (tarification, formule, montant, callback) {
	mysql(function (connection) {
		var sql = "UPDATE Montant SET montantForfaitaire = " + montant + "\n" +
			"WHERE tarificationCode = '" + tarification + "' AND \n" +
			"formuleType = '" + formule + "'";
		connection.query(sql, function (err, result) {
			if (err) console.error('UPDATE MONTANT : ' + err.message);
			callback({err: err, insert: false, table: 'Montant', rows: result.affectedRows});
		});
	});
};

exports.insert = function (montant, callback) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO\n" +
		"Montant(tarificationCode, formuleType, montantForfaitaire)\n" +
		"VALUES(:tarificationCode, :formuleType, :montantForfaitaire)";
		connection.query(sql, montant, function (err, result) {
			if (err) console.error('INSERT MONTANT : ' + err.message);
			console.log('INSERTED IN MONTANT');
			callback({err: err, insert: true, table: 'Montant'});
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

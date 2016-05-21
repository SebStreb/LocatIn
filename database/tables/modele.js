'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Modele( \n" +
			"marque VARCHAR(20) NOT NULL, \n" +
			"type VARCHAR(20) NOT NULL, \n" +
			"optionCode CHAR(2) NOT NULL, \n" +
			"tarificationCode CHAR(2) NOT NULL, \n" +
			"puissance FLOAT DEFAULT 150.0, \n" +
			"PRIMARY KEY (marque, type), \n" +
			"FOREIGN KEY (optionCode) REFERENCES Options(code), \n" +
			"FOREIGN KEY (tarificationCode) REFERENCES Tarification(code), \n" +
			"CHECK (puissance > 0)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE MODELE : ' + err.message);
		});
	});
};

exports.insert = function (modele) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO \n" +
		"Modele(marque, type, optionCode, tarificationCode) \n" +
		"VALUES(:marque, :type, :optionCode, :tarificationCode)";
		connection.query(sql, modele, function (err, result) {
			if (err) console.error('INSERT MODELE : ' + err.message);
			console.log('INSERTED IN MODELE');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Modele";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY MODELE : ' + err.message);
		});
	});
};

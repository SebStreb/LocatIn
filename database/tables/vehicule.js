'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Vehicule( \n" +
			"numero INT PRIMARY KEY AUTO_INCREMENT NOT NULL, \n" +
			"modeleMarque VARCHAR(20) NOT NULL, \n" +
			"modeleType VARCHAR(20) NOT NULL, \n" +
			"dateAchat DATETIME DEFAULT NOW(), \n" +
			"prixAchat FLOAT DEFAULT 15000.0, \n" +
			"dateRestitution DATETIME, \n" +
			"FOREIGN KEY (modeleMarque, modeleType) REFERENCES Modele(marque, type), \n" +
			"CHECK (prixAchat > 0) \n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE VEHICULE : ' + err.code);
		});
	});
};

exports.insert = function (vehicule) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO Vehicule(modeleMarque, modeleType) \n" +
		"VALUES(:modeleMarque, :modeleType)";
		connection.query(sql, vehicule, function (err, result) {
			if (err) console.error('INSERT VEHICULE : ' + err.code);
			console.log('INSERTED ID ' + result.insertId + ' IN VEHICULE');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Vehicule";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY VEHICULE : ' + err.code);
		});
	});
};
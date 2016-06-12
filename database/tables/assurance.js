'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Assurance(\n" +
			"type VARCHAR(20) PRIMARY KEY NOT NULL,\n" +
			"assureurPrenom VARCHAR(20) NOT NULL,\n" +
			"assureurNom VARCHAR(20) NOT NULL,\n" +
			"FOREIGN KEY (assureurPrenom, assureurNom) REFERENCES Assureur(prenom, nom)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE ASSURANCE : ' + err.message);
		});
	});
};

exports.getAll = function (callback) {
	mysql(function (connection) {
		var sql =
		"SELECT type FROM Assurance\n";
		connection.query(sql, function (err, result) {
			if (err) console.error('GET ASSURANCE : ' + err.message);
			callback(result);
		});
	});
};

exports.insert = function (assurance, callback) {
	mysql(function (connection) {
		var sql =
		"INSERT IGNORE INTO Assurance(type, assureurPrenom, assureurNom)\n" +
		"VALUES(:type, :assureurPrenom, :assureurNom)";
		connection.query(sql, assurance, function (err, result) {
			if (err) console.error('INSERT ASSURANCE : ' + err.message);
			console.log('INSERTED ASSURANCE');
			callback({err: err, insert: true, table: 'Assurance'});
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Assurance";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY ASSURANCE : ' + err.message);
		});
	});
};

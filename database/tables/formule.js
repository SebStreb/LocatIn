'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Formule(\n" +
			"type VARCHAR(20) PRIMARY KEY NOT NULL,\n" +
			"kilometrageForfaitaire FLOAT NOT NULL,\n" +
			"CHECK (kilometrageForfaitaire > 0)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE FORMULE : ' + err.message);
		});
	});
};

exports.getAll = function (callback) {
	mysql(function (connection) {
		var sql = "SELECT F.type AS 'Type'\n" +
		"FROM Formule F";
		connection.query(sql, function (err, result) {
			if (err) console.error('SEARCH FORMULE : ' + err.message);
			callback(result);
		});
	});
};

exports.insert = function (formule, callback) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO\n" +
		"Formule(type, kilometrageForfaitaire)\n" +
		"VALUES(:type, :kilometrageForfaitaire)";
		connection.query(sql, formule, function (err, result) {
			if (err) console.error('INSERT FORMULE : ' + err.message);
			console.log('INSERTED IN FORMULE');
			callback({err: err, insert: true, table: 'Formule'});
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Formule";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY FORMULE : ' + err.message);
		});
	});
};

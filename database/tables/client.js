'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Client(\n" +
			"id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,\n" +
			"prenom VARCHAR(20) NOT NULL,\n" +
			"nom VARCHAR(20) NOT NULL,\n" +
			"adresse VARCHAR(60),\n" +
			"telephone VARCHAR(10)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE CLIENT : ' + err.message);
		});
	});
};

exports.getAll = function (callback) {
	mysql(function (connection) {
		var sql = "SELECT id AS ID, CONCAT(C.prenom, ' ', C.nom) AS 'Client'\n" +
		"FROM Client C";
		connection.query(sql, function (err, result) {
			if (err) console.error('SEARCH CLIENT : ' + err.message);
			callback(result);
		});
	});
};

exports.insert = function (client) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO Client(prenom, nom) \n" +
		"VALUES(:prenom, :nom)";
		connection.query(sql, client, function (err, result) {
			if (err) console.error('INSERT CLIENT : ' + err.message);
			console.log('INSERTED ID ' + result.insertId + ' IN CLIENT');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Assureur";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY CLIENT : ' + err.message);
		});
	});
};

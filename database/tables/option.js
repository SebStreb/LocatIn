'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Options(\n" +
			"code CHAR(2) PRIMARY KEY NOT NULL,\n" +
			"libelle VARCHAR(20) NOT NULL\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE OPTION : ' + err.code);
		});
	});
};

exports.insert = function (option) {
	mysql(function (connection) {
		var sql =
		"INSERT IGNORE INTO Options(code, libelle) VALUES(:code, :libelle)";
		connection.query(sql, option, function (err, result) {
			if (err) console.error('INSERT OPTION : ' + err.code);
			console.log('INSERTED IN OPTION');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Options";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY OPTION : ' + err.code);
		});
	});
};

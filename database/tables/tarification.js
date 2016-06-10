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

exports.getPrixKil = function (callback) {
	mysql(function (connection) {
		var sql = "SELECT T.code as 'Code', prixKilometre as 'Kil'\n" +
			"FROM Tarification T";
		connection.query(sql, function (err, result) {
			if (err) console.error('GET TARIFICATION PRICES KILOMETRE : ' + err.message);
			callback(result);
		});
	});
};

exports.getPrixJour = function (callback) {
	mysql(function (connection) {
		var sql = "SELECT T.code as 'Code', amendeJournaliere as 'Jour'\n" +
			"FROM Tarification T";
		connection.query(sql, function (err, result) {
			if (err) console.error('GET TARIFICATION PRICES JOUR : ' + err.message);
			callback(result);
		});
	});
};

exports.getAll = function (callback) {
	mysql(function (connection) {
		var sql = "SELECT T.code as 'Code' FROM Tarification T";
		connection.query(sql, function (err, result) {
			if (err) console.error('SEARCH TARIFICATION : ' + err.message);
			callback(result);
		});
	});
};

exports.setKil = function (tarification, value, callback) {
	mysql(function (connection) {
		var sql = "UPDATE Tarification SET prixKilometre = " + value + "\n" +
			"WHERE code = '" + tarification + "'";
		connection.query(sql, function (err, result) {
			if (err) console.error('UPDATE TARIFICATION KIL : ' + err.message);
			callback({err: err, insert: false, table: 'Tarification', rows: result.affectedRows});
		});
	});
};

exports.setJour = function (tarification, value, callback) {
	mysql(function (connection) {
		var sql = "UPDATE Tarification SET amendeJournaliere = " + value + "\n" +
			"WHERE code = '" + tarification + "'";
		connection.query(sql, function (err, result) {
			if (err) console.error('UPDATE TARIFICATION JOUR : ' + err.message);
			callback({err: err, insert: false, table: 'Tarification', rows: result.affectedRows});
		});
	});
};

exports.insert = function (tarification, callback) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO \n" +
		"Tarification(code, assuranceType, prixKilometre, amendeJournaliere) \n" +
		"VALUES(:code, :assuranceType, :prixKilometre, :amendeJournaliere) ";
		connection.query(sql, tarification, function (err, result) {
			if (err) console.error('INSERT TARIFICATION : ' + err.message);
			console.log('INSERTED IN TARIFICATION');
			callback({err: err, insert: true, table: 'Tarification'});
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

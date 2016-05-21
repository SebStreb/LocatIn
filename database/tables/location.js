'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Location(\n" +
			"numeroContrat INT PRIMARY KEY AUTO_INCREMENT NOT NULL,\n" +
			"reservationNumero INT NOT NULL,\n" +
			"kilometrageDepart FLOAT NOT NULL,\n" +
			"dateDepart DATETIME DEFAULT NOW(),\n" +
			"numeroPermis VARCHAR(10),\n" +
			"paiementCaution TINYINT DEFAULT 1,\n" +
			"FOREIGN KEY (reservationNumero) REFERENCES Reservation(numero),\n" +
			"CHECK (kilometrageDepart > 0)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE LOCATION : ' + err.message);
		});
	});
};

exports.insert = function (location) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO\n" +
		"Location(reservationNumero, kilometrageDepart, dateDepart, paiementCaution)\n" +
		"VALUES(:reservationNumero, :kilometrageDepart, :dateDepart, :paiementCaution)";
		connection.query(sql, location, function (err, result) {
			if (err) console.error('INSERT LOCATION : ' + err.message);
			console.log('INSERTED ID ' + result.insertId + ' IN LOCATION');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Location";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY LOCATION : ' + err.message);
		});
	});
};

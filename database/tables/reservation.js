'use strict';

var mysql = require('../connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS Reservation(\n" +
			"numero INT PRIMARY KEY AUTO_INCREMENT NOT NULL,\n" +
			"formuleType VARCHAR(20) NOT NULL,\n" +
			"vehiculeNumero INT NOT NULL,\n" +
			"clientId INT NOT NULL,\n" +
			"dateEffectuee DATETIME DEFAULT NOW(),\n" +
			"dateDemandee DATETIME DEFAULT NOW(),\n" +
			"disponibiliteReelle TINYINT DEFAULT 1,\n" +
			"etat VARCHAR(50),\n" +
			"dateAnnulation DATETIME,\n" +
			"nouvelleReservationNumero INT,\n" +
			"FOREIGN KEY (formuleType) REFERENCES Formule(type),\n" +
			"FOREIGN KEY (vehiculeNumero) REFERENCES Vehicule(numero),\n" +
			"FOREIGN KEY (clientId) REFERENCES Client(id),\n" +
			"FOREIGN KEY (nouvelleReservationNumero) REFERENCES Reservation(numero)\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE RESERVATION : ' + err.message);
		});
	});
};

exports.insert = function (reservation) {
	mysql(function (connection) {
		var sql = "INSERT IGNORE INTO\n" +
		"Reservation(formuleType, vehiculeNumero, clientId, etat, dateAnnulation, nouvelleReservationNumero)\n" +
		"VALUES(:formuleType, :vehiculeNumero, :clientId, :etat, :dateAnnulation, :nouvelleReservationNumero)";
		connection.query(sql, reservation, function (err, result) {
			if (err) console.error('INSERT RESERVATION : ' + err.message);
			console.log('INSERTED ID ' + result.insertId + ' IN RESERVATION');
		});
	});
};

exports.update = function (find, replace) {
	mysql(function (connection) {
		var sql = "UPDATE Reservation\n" +
		"SET etat = :etat, nouvelleReservationNumero= :nouvelleReservationNumero WHERE numero = " + find.numero;
		connection.query(sql, replace, function (err, result) {
			if (err) console.error('UPDATE RESERVATION : ' + err.message);
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS Reservation";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY RESERVATION : ' + err.message);
		});
	});
};

var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Facture(" +
			"numero INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
			"locationNumeroContrat INTEGER," +
			"FOREIGN KEY (locationNumeroContrat) REFERENCES Location(numeroContrat)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (facture) {
	var sql = "INSERT OR IGNORE INTO Facture(locationNumeroContrat) VALUES($locationNumeroContrat)";
	db.serialize(function () {
		db.run(sql, facture, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Facture";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

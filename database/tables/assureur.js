var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Assureur(" +
			"prenom TEXT NOT NULL," +
			"nom TEXT NOT NULL," +
			"adresse TEXT," +
			"telephone TEXT, " +
			"fax TEXT, " +
			"PRIMARY KEY(prenom, nom)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (assureur) {
	var sql = "INSERT OR IGNORE INTO Assureur(prenom, nom) VALUES($prenom, $nom)";
	db.serialize(function () {
		db.run(sql, assureur, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Assureur";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

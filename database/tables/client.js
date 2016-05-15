var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Client(" +
			"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
			"prenom TEXT NOT NULL," +
			"nom TEXT NOT NULL," +
			"adresse TEXT," +
			"telephone TEXT" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (client) {
	var sql = "INSERT OR IGNORE INTO Client(prenom, nom) VALUES($prenom, $nom)";
	db.serialize(function () {
		db.run(sql, client, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Client";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

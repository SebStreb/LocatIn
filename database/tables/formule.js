var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Formule(" +
			"type TEXT PRIMARY KEY NOT NULL," +
			"kilometrageForfaitaire REAL NOT NULL" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (formule) {
	var sql = "INSERT OR IGNORE INTO Formule(type, kilometrageForfaitaire) VALUES($type, $kilometrageForfaitaire)";
	db.serialize(function () {
		db.run(sql, formule, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Formule";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

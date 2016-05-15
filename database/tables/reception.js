var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Reception(" +
			"locationNumeroContrat INTEGER PRIMARY KEY NOT NULL," +
			"kilometrageArrivee REAL NOT NULL," +
			"dateArrivee DATETIME," +
			"dommage TEXT," +
			"FOREIGN KEY (locationNumeroContrat) REFERENCES Location(numeroContrat)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (reception) {
	var sql = "INSERT OR IGNORE INTO Reception(locationNumeroContrat, kilometrageArrivee, dateArrivee) VALUES($locationNumeroContrat, $kilometrageArrivee, $dateArrivee)";
	db.serialize(function () {
		db.run(sql, reception, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Reception";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

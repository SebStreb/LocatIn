var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Vehicule(" +
			"numero INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
			"modeleMarque TEXT NOT NULL," +
			"modeleType TEXT NOT NULL," +
			"dateAchat DATETIME," +
			"prixAchat REAL DEFAULT 15000.0," +
			"dateRestitution DATETIME," +
			"FOREIGN KEY (modeleMarque, modeleType) REFERENCES Modele(marque, type)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (vehicule) {
	var sql = "INSERT OR IGNORE INTO Vehicule(modeleMarque, modeleType) VALUES($modeleMarque, $modeleType)";
	db.serialize(function () {
		db.run(sql, vehicule, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Vehicule";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

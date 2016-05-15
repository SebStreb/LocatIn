var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Tarification(" +
			"code TEXT PRIMARY KEY NOT NULL," +
			"assuranceType TEXT NOT NULL," +
			"prixKilometre REAL NOT NULL," +
			"amendeJournaliere REAL NOT NULL," +
			"FOREIGN KEY (assuranceType) REFERENCES Assurance(type)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (tarification) {
	var sql = "INSERT OR IGNORE INTO Tarification(code, assuranceType, prixKilometre, amendeJournaliere) VALUES($code, $assuranceType, $prixKilometre, $amendeJournaliere)";
	db.serialize(function () {
		db.run(sql, tarification, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Tarification";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

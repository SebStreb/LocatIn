var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Montant(" +
			"tarificationCode TEXT NOT NULL," +
			"formuleType TEXT NOT NULL," +
			"montantForfaitaire REAL NOT NULL," +
			"PRIMARY KEY (tarificationCode, formuleType)," +
			"FOREIGN KEY (tarificationCode) REFERENCES Tarification(code)," +
			"FOREIGN KEY (formuleType) REFERENCES Formule(type)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (montant) {
	var sql = "INSERT OR IGNORE INTO Montant(tarificationCode, formuleType, montantForfaitaire) VALUES($tarificationCode, $formuleType, $montantForfaitaire)";
	db.serialize(function () {
		db.run(sql, montant, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Montant";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

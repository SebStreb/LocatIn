var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Modele(" +
			"marque TEXT NOT NULL," +
			"type TEXT NOT NULL," +
			"optionCode TEXT NOT NULL," +
			"tarificationCode TEXT NOT NULL," +
			"puissance REAL DEFAULT 150.0," +
			"PRIMARY KEY (marque, type)," +
			"FOREIGN KEY (optionCode) REFERENCES Option(code)," +
			"FOREIGN KEY (tarificationCode) REFERENCES Tarification(code)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (modele) {
	var sql = "INSERT OR IGNORE INTO Modele(marque, type, optionCode, tarificationCode) VALUES($marque, $type, $optionCode, $tarificationCode)";
	db.serialize(function () {
		db.run(sql, modele, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Modele";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

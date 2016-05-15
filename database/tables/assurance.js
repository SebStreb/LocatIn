var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Assurance(" +
			"type TEXT PRIMARY KEY NOT NULL," +
			"assureurPrenom TEXT NOT NULL," +
			"assureurNom TEXT NOT NULL," +
			"FOREIGN KEY (assureurPrenom, assureurNom) REFERENCES Assureur(prenom, nom)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (assurance) {
	var sql = "INSERT OR IGNORE INTO Assurance(type, assureurPrenom, assureurNom) VALUES($type, $assureurPrenom, $assureurNom)";
	db.serialize(function () {
		db.run(sql, assurance, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Assurance";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

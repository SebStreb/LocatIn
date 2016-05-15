var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Location(" +
			"numeroContrat INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
			"reservationNumero INTEGER NOT NULL," +
			"kilometrageDepart REAL NOT NULL," +
			"dateDepart DATETIME," +
			"numeroPermis TEXT," +
			"paiementCaution INTEGER DEFAULT 1," +
			"FOREIGN KEY (reservationNumero) REFERENCES Reservation(numero)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (location) {
	var sql = "INSERT OR IGNORE INTO Location(reservationNumero, kilometrageDepart, dateDepart, paiementCaution) VALUES($reservationNumero, $kilometrageDepart, $dateDepart, $paiementCaution)";
	db.serialize(function () {
		db.run(sql, location, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Location";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS Reservation(" +
			"numero INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
			"formuleType TEXT NOT NULL," +
			"vehiculeNumero INTEGER NOT NULL," +
			"clientId INTEGER NOT NULL," +
			"dateEffectuee DATETIME," +
			"dateDemandee DATETIME," +
			"disponibiliteReelle INTEGER DEFAULT 1," +
			"etat TEXT," +
			"dateAnnulation DATETIME," +
			"nouvelleReservationNumero INTEGER," +
			"FOREIGN KEY (formuleType) REFERENCES Formule(type)," +
			"FOREIGN KEY (vehiculeNumero) REFERENCES Vehicule(numero)," +
			"FOREIGN KEY (clientId) REFERENCES Client(id)," +
			"FOREIGN KEY (nouvelleReservationNumero) REFERENCES Reservation(numero)" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (reservation) {
	var sql = "INSERT OR IGNORE INTO Reservation(formuleType, vehiculeNumero, clientId, etat, dateAnnulation, nouvelleReservationNumero) VALUES($formuleType, $vehiculeNumero, $clientId, $etat, $dateAnnulation, $nouvelleReservationNumero)";
	db.serialize(function () {
		db.run(sql, reservation, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Reservation";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

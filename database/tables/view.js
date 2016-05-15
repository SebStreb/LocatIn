var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE VIEW IF NOT EXISTS VFacture AS " +
			"SELECT " +
				"Fa.numero AS factureNumero, " +
				"L.numeroContrat AS numeroContrat, " +
				"C.id AS clientId, " +
				"Mon.montantForfaitaire AS montantBase, " +
				"CASE " +
					"WHEN L.paiementCaution = 0 THEN " +
						"(Mon.montantForfaitaire / 100) * 3 " +
					"ELSE " +
						"0 " +
				"END AS fraisPaiementCaution, " +
				"CASE " +
					"WHEN Fo.type = 'Journée' AND Rec.dateArrivee > datetime(L.dateDepart, '+1 days') THEN " +
						"(julianday(Rec.dateArrivee, '+1 days', 'start of day') - julianday(L.dateDepart, '+1 days', 'start of day')) * T.amendeJournaliere " +
					"WHEN Fo.type = 'Semaine' AND Rec.dateArrivee > datetime(L.dateDepart, '+1 weeks') THEN " +
						"(julianday(Rec.dateArrivee, '+1 days', 'start of day') - julianday(L.dateDepart, '+1 weeks', 'start of day')) * T.amendeJournaliere " +
					"WHEN Fo.type = 'Week-end' AND Rec.dateArrivee > datetime(L.dateDepart, '+3 days', 'start of day', '+7 hours', '+30 minutes') THEN " +
						"(julianday(Rec.dateArrivee, '+1 days', 'start of day') - julianday(L.dateDepart, '+3 days', 'start of day')) * T.amendeJournaliere " +
					"ELSE " +
						"0 " +
				"END AS fraisJoursSupps, " +
				"CASE " +
					"WHEN Rec.kilometrageArrivee - L.kilometrageDepart > Fo.kilometrageForfaitaire THEN " +
						"(Rec.kilometrageArrivee - L.kilometrageDepart - Fo.kilometrageForfaitaire) * T.prixKilometre " +
					"ELSE " +
						"0 " +
				"END AS fraisKmSupps, " +
				"CASE " +
					"WHEN EXISTS (SELECT R.numero FROM Reservation R WHERE R.nouvelleReservationNumero = Res.numero) THEN " +
						"T.amendeJournaliere " +
					"ELSE " +
						"0 " +
				"END AS compensationAnnulation " +
			"FROM Client C, Facture Fa, Formule Fo, Location L, Montant Mon, Modele Mod, Reception Rec, Reservation Res, Tarification T, Vehicule V " +
			"WHERE " +
				"Fa.locationNumeroContrat = L.numeroContrat AND " +
				"Rec.locationNumeroContrat = L.numeroContrat AND " +
				"L.reservationNumero = Res.numero AND " +
				"Res.formuleType = Fo.type AND " +
				"Res.vehiculeNumero = V.numero AND " +
				"Res.clientId = C.id AND " +
				"Mon.tarificationCode = T.code AND " +
				"Mon.formuleType = Fo.type AND " +
				"V.modeleMarque = Mod.marque AND " +
				"V.modeleType = Mod.type AND " +
				"Mod.tarificationCode = T.code " +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.destroy = function () {
	var sql = "DROP VIEW IF EXISTS VFacture";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
}

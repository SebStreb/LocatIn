'use strict';

var mysql = require('./connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE OR REPLACE VIEW VFacture AS\n" +
			"SELECT\n" +
				"Fa.numero AS factureNumero,\n" +
				"L.numeroContrat AS numeroContrat,\n" +
				"C.id AS clientId,\n" +
				"M.montantForfaitaire AS montantBase,\n" +
				"CASE\n" +
					"WHEN L.paiementCaution = 0 THEN\n" +
						"(M.montantForfaitaire / 100) * 3\n" +
					"ELSE\n" +
						"0\n" +
				"END AS fraisPaiementCaution,\n" +
				"CASE\n" +
					"WHEN Fo.type = 'Journée' AND Rec.dateArrivee > L.dateDepart + INTERVAL 1 DAY THEN\n" +
						"(DATEDIFF(Rec.dateArrivee, L.dateDepart) - 1) * T.amendeJournaliere\n" +
					"WHEN Fo.type = 'Semaine' AND Rec.dateArrivee > L.dateDepart + INTERVAL 1 WEEK THEN\n" +
						"(DATEDIFF(Rec.dateArrivee, L.dateDepart) - 7) * T.amendeJournaliere\n" +
					"WHEN Fo.type = 'Week-end' AND Rec.dateArrivee > L.dateDepart + INTERVAL 3 DAY THEN\n" +
						"(DATEDIFF(Rec.dateArrivee, L.dateDepart) - 3) * T.amendeJournaliere\n" +
					"ELSE\n" +
						"0\n" +
				"END AS fraisJoursSupps,\n" +
				"CASE\n" +
					"WHEN Rec.kilometrageArrivee - L.kilometrageDepart > Fo.kilometrageForfaitaire THEN\n" +
						"(Rec.kilometrageArrivee - L.kilometrageDepart - Fo.kilometrageForfaitaire) * T.prixKilometre\n" +
					"ELSE\n" +
						"0\n" +
				"END AS fraisKmSupps,\n" +
				"CASE\n" +
					"WHEN EXISTS (SELECT R.numero FROM Reservation R WHERE R.nouvelleReservationNumero = Res.numero) THEN\n" +
						"T.amendeJournaliere\n" +
					"ELSE\n" +
						"0\n" +
				"END AS compensationAnnulation\n" +
			"FROM Client C, Facture Fa, Formule Fo, Location L, Montant M, Modele Mo, Reception Rec, Reservation Res, Tarification T, Vehicule V\n" +
			"WHERE\n" +
				"Fa.locationNumeroContrat = L.numeroContrat AND\n" +
				"Rec.locationNumeroContrat = L.numeroContrat AND\n" +
				"L.reservationNumero = Res.numero AND\n" +
				"Res.formuleType = Fo.type AND\n" +
				"Res.vehiculeNumero = V.numero AND\n" +
				"Res.clientId = C.id AND\n" +
				"M.tarificationCode = T.code AND\n" +
				"M.formuleType = Fo.type AND\n" +
				"V.modeleMarque = Mo.marque AND\n" +
				"V.modeleType = Mo.type AND\n" +
				"Mo.tarificationCode = T.code\n"
		;
		connection.query(sql, function (err) {
			if (err) console.error('CREATE VIEW : ' + err);
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS VFacture";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY VIEW : ' + err.code);
		});
	});
};

var mysql = require('./connect.js');

exports.getSupply = function (callback) {
	mysql(function (connection) {
		var sql =
		"SELECT\n" +
			"CONCAT(M.marque, ' ', M.type) AS 'Model',\n" +
			"COUNT(V.numero) AS 'Total number of cars',\n" +
			"O.libelle AS 'Options',\n" +
			"CONCAT(Mo.montantForfaitaire, ' €') AS 'Price for a day',\n" +
			"CONCAT(T.prixKilometre, ' €') AS 'Exceded kilometer price',\n" +
			"CONCAT(T.amendeJournaliere, ' €') AS 'Exceded day price'\n" +
		"FROM Vehicule V\n" +
		"LEFT JOIN Modele M ON V.modeleMarque = M.marque AND V.modeleType = M.type\n" +
		"LEFT JOIN Options O ON M.optionCode = O.code\n" +
		"LEFT JOIN Tarification T On M.tarificationCode = T.code\n" +
		"LEFT JOIN Montant Mo ON Mo.tarificationCode = T.code\n" +
		"WHERE Mo.formuleType = 'Journée'\n" +
		"GROUP BY M.marque, M.type"
		;
		connection.query(sql, function (err, result, fields) {
			if (err) console.error('GET SUPPLY : ' + err.message);
			callback(result, fields);
		});
	});
};

exports.getRes = function (callback) {
	mysql(function (connection) {
		var sql =
		"SELECT\n" +
			"V.numero AS 'Car number',\n" +
			"CONCAT(V.modeleMarque, ' ', V.modeleType) AS 'Model',\n" +
			"R.numero AS 'Reservation number',\n" +
			"CONCAT(C.prenom, ' ', C.nom) AS 'Client',\n" +
			"R.dateDemandee AS 'Departure date'\n" +
		"FROM Reservation R\n" +
		"LEFT JOIN Vehicule V ON R.vehiculeNumero = V.numero\n" +
		"LEFT JOIN Client C ON R.clientId = C.Id\n" +
		"WHERE\n" +
			"R.etat = 'Effectif' AND\n" +
			"NOT EXISTS (\n" +
				"SELECT L.numeroContrat\n" +
				"FROM Location L\n" +
				"WHERE L.reservationNumero = R.numero\n" +
			")"
		;
		connection.query(sql, function (err, result, fields) {
			if (err) console.error('GET RESERVATION : ' + err.message);
			callback(result, fields);
		});
	});
};

exports.getLoc = function (callback) {
	mysql(function (connection) {
		var sql =
		"SELECT\n" +
			"V.numero AS 'Car number',\n" +
			"CONCAT(V.modeleMarque, ' ', V.modeleType) AS 'Model',\n" +
			"R.numero AS 'Reservation number',\n" +
			"CONCAT(C.prenom, ' ', C.nom) AS 'Client',\n" +
			"CASE\n" +
				"WHEN F.type = 'Journée' THEN\n" +
					"R.dateDemandee + INTERVAL 1 DAY\n" +
				"WHEN F.type = 'Semaine' THEN\n" +
					"R.dateDemandee + INTERVAL 1 WEEK\n" +
				"WHEN F.type = 'Week-end' THEN\n" +
					"R.dateDemandee + INTERVAL 3 DAY\n" +
			"END AS 'Return date'\n" +
		"FROM Reservation R\n" +
		"LEFT JOIN Vehicule V ON R.vehiculeNumero = V.numero\n" +
		"LEFT JOIN Client C ON R.clientId = C.Id\n" +
		"LEFT JOIN Formule F ON R.formuleType = F.type\n" +
		"WHERE\n" +
			"R.etat = 'Effectif' AND\n" +
			"EXISTS (\n" +
				"SELECT L.numeroContrat\n" +
				"FROM Location L\n" +
				"WHERE L.reservationNumero = R.numero\n" +
			")"
		;
		connection.query(sql, function (err, result, fields) {
			if (err) console.error('GET LOCATION : ' + err.message);
			callback(result, fields);
		});
	});
};

exports.getHist = function (callback) {
	mysql(function (connection) {
		var sql =
		"SELECT\n" +
			"V.numero AS 'Car number',\n" +
			"CONCAT(V.modeleMarque, ' ', V.modeleType) AS 'Model',\n" +
			"L.numeroContrat AS 'Contract number',\n" +
			"CONCAT(C.prenom, ' ', C.nom) AS 'Client',\n" +
			"Re.dommage AS 'Dammage'\n" +
		"FROM Location L\n" +
		"LEFT JOIN Reservation R ON L.reservationNumero = R.numero\n" +
		"LEFT JOIN Reception Re ON Re.locationNumeroContrat = L.numeroContrat\n" +
		"LEFT JOIN Vehicule V ON R.vehiculeNumero = V.numero\n" +
		"LEFT JOIN Client C ON R.clientId = C.Id\n" +
		"WHERE\n" +
			"R.etat = 'Terminée'"
		;
		connection.query(sql, function (err, result, fields) {
			if (err) console.error('GET HISTORY : ' + err.message);
			callback(result, fields);
		});
	});
};

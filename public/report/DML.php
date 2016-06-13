<?php
	function catalogueQuery()
	{
		$sql = "
			SELECT
				M.marque || ' ' || M.type AS 'Modèle',
				COUNT(V.numero) AS 'Nombre de voitures',
				O.libelle AS 'Options',
				Mo.montantForfaitaire || ' €' AS 'Montant pour une journée',
				T.prixKilometre || ' €' AS 'Prix par kilomètre supplémentaire',
				T.amendeJournaliere || ' €' AS 'Amende Journalière'
			FROM Vehicule V, Modele M, Option O, Tarification T, Montant Mo
			WHERE
				V.modeleMarque = M.marque AND
				V.modeleType = M.type AND
				M.optionCode = O.code AND
				M.tarificationCode = T.code AND
				Mo.tarificationCode = T.code AND
				Mo.formuleType = 'Journée'
			GROUP BY M.marque, M.type
			;
		";
		return $sql;
	}

	function locationQuery()
	{
		$sql = "
			SELECT
				V.numero AS 'Numéro de véhicule',
				V.modeleMarque || ' ' || V.modeleType AS 'Modèle',
				Res.numero AS 'Numéro de réservation',
				C.prenom || ' ' || C.nom AS 'Client',
				CASE
					WHEN F.type = 'Journée' THEN
						datetime(L.dateDepart, '+1 days')
					WHEN F.type = 'Semaine' THEN
						datetime(L.dateDepart, '+7 days')
					WHEN F.type = 'Week-end' THEN
						datetime(L.dateDepart, '+3 days', 'start of day', '+7 hours', '+30 minutes')
				END AS 'Date de retour supposée'
			FROM Vehicule V, Reservation Res, Client C, Formule F, Location L
			WHERE
				Res.vehiculeNumero = V.numero AND
				Res.clientId = C.id AND
				Res.formuleType = F.type AND
				L.reservationNumero = Res.numero AND
				Res.etat = 'Effectif' AND
				EXISTS (
					SELECT L.numeroContrat
					FROM Location L
					WHERE L.reservationNumero = Res.numero
				)
			;
		";
		return $sql;
	}

	function fideliteQuery()
	{
		$sql = "
			SELECT
				V.clientId AS 'ID client',
				C.prenom || ' ' || C.nom AS 'Client',
				COUNT(V.factureNumero) AS 'Nombre de locations',
				SUM(V.montantBase + V.fraisPaiementCaution + V.fraisJoursSupps + V.fraisKmSupps - V.compensationAnnulation) || ' €' AS 'Dépenses'
			FROM Facture F, Client C, VFacture V
			WHERE
				V.factureNumero = F.numero AND
				V.clientId = C.id
			GROUP BY clientId
			HAVING COUNT(factureNumero) >= 2
			ORDER BY 'Dépenses' DESC
			;
		";
		return $sql;
	}

	function clientQuery()
	{
		$sql = "
			SELECT
				id AS 'ID',
				prenom || ' ' || nom AS 'Client'
			FROM Client
		";
		return $sql;
	}

	function factureQuery($id)
	{
		if ($id == '') {
			$sql = "
			SELECT
				V.factureNumero AS 'Numéro de facture',
				V.numeroContrat AS 'Numéro de contrat',
				C.prenom || ' ' || C.nom AS 'Client',
				C.adresse AS 'Adresse de facturation',
				V.montantBase + V.fraisPaiementCaution + V.fraisJoursSupps + V.fraisKmSupps - V.compensationAnnulation AS 'Montant'
			FROM VFacture V, Client C
			WHERE V.clientId = C.id
			ORDER BY V.factureNumero DESC
			;
			";
		} else {
			$sql = "
			SELECT
				V.factureNumero AS 'Numéro de facture',
				V.numeroContrat AS 'Numéro de contrat',
				C.prenom || ' ' || C.nom AS 'Client',
				C.adresse AS 'Adresse de facturation',
				V.montantBase + V.fraisPaiementCaution + V.fraisJoursSupps + V.fraisKmSupps - V.compensationAnnulation AS 'Montant'
			FROM VFacture V, Client C
			WHERE V.clientId = C.id AND C.id = " . $id . "
			ORDER BY V.factureNumero DESC
			;
			";
		}
		return $sql;
	}

	function optionQuery()
	{
		$sql = "
			SELECT
				code AS 'Code',
				libelle AS 'Option'
			FROM Option
		";
		return $sql;
	}

	function modeleQuery()
	{
		$sql = "
			SELECT
				marque || ' ' || type AS 'Modèle'
			FROM Modele
		";
		return $sql;
	}

	function propositionQuery($opt, $mod)
	{
		if ($opt == '' && $mod == '') {
			$sql = "
			SELECT
				V.numero AS 'Numéro de véhicule',
				M.marque || ' ' || M.type AS 'Modèle',
				O.libelle AS 'Option',
				Mo.montantForfaitaire || ' €' AS 'Montant pour une journée',
				T.prixKilometre || ' €' AS 'Prix par kilomètre supplémentaire',
				T.amendeJournaliere || ' €' AS 'Amende Journalière'
			FROM Vehicule V, Modele M, Option O, Tarification T, Montant Mo
			WHERE
				V.modeleMarque = M.marque AND
				V.modeleType = M.type AND
				M.optionCode = O.code AND
				M.tarificationCode = T.code AND
				Mo.tarificationCode = T.code AND
				Mo.formuleType = 'Journée' AND
				V.numero NOT IN (
					SELECT
						V.numero AS 'Numéro de véhicule'
					FROM Vehicule V, Reservation Res
					WHERE
						Res.vehiculeNumero = V.numero AND
						Res.etat = 'Effectif'
				) AND
				V.dateRestitution IS NULL
			;
			";
		} elseif ($opt == '') {
			$sql = "
			SELECT
				V.numero AS 'Numéro de véhicule',
				M.marque || ' ' || M.type AS 'Modèle',
				O.libelle AS 'Option',
				Mo.montantForfaitaire || ' €' AS 'Montant pour une journée',
				T.prixKilometre || ' €' AS 'Prix par kilomètre supplémentaire',
				T.amendeJournaliere || ' €' AS 'Amende Journalière'
			FROM Vehicule V, Modele M, Option O, Tarification T, Montant Mo
			WHERE
				V.modeleMarque = M.marque AND
				V.modeleType = M.type AND
				M.optionCode = O.code AND
				M.tarificationCode = T.code AND
				Mo.tarificationCode = T.code AND
				Mo.formuleType = 'Journée' AND
				M.marque || ' ' || M.type = '" . $mod . "' AND
				V.numero NOT IN (
					SELECT
						V.numero AS 'Numéro de véhicule'
					FROM Vehicule V, Reservation Res
					WHERE
						Res.vehiculeNumero = V.numero AND
						Res.etat = 'Effectif'
				) AND
				V.dateRestitution IS NULL
			;
			";
		} elseif ($mod == '') {
			$sql = "
			SELECT
				V.numero AS 'Numéro de véhicule',
				M.marque || ' ' || M.type AS 'Modèle',
				O.libelle AS 'Option',
				Mo.montantForfaitaire || ' €' AS 'Montant pour une journée',
				T.prixKilometre || ' €' AS 'Prix par kilomètre supplémentaire',
				T.amendeJournaliere || ' €' AS 'Amende Journalière'
			FROM Vehicule V, Modele M, Option O, Tarification T, Montant Mo
			WHERE
				V.modeleMarque = M.marque AND
				V.modeleType = M.type AND
				M.optionCode = O.code AND
				M.tarificationCode = T.code AND
				Mo.tarificationCode = T.code AND
				Mo.formuleType = 'Journée' AND
				O.code = '" . $opt . "' AND
				V.numero NOT IN (
					SELECT
						V.numero AS 'Numéro de véhicule'
					FROM Vehicule V, Reservation Res
					WHERE
						Res.vehiculeNumero = V.numero AND
						Res.etat = 'Effectif'
				) AND
				V.dateRestitution IS NULL
			;
			";
		} else {
			$sql = "
			SELECT
				V.numero AS 'Numéro de véhicule',
				M.marque || ' ' || M.type AS 'Modèle',
				O.libelle AS 'Option',
				Mo.montantForfaitaire || ' €' AS 'Montant pour une journée',
				T.prixKilometre || ' €' AS 'Prix par kilomètre supplémentaire',
				T.amendeJournaliere || ' €' AS 'Amende Journalière'
			FROM Vehicule V, Modele M, Option O, Tarification T, Montant Mo
			WHERE
				V.modeleMarque = M.marque AND
				V.modeleType = M.type AND
				M.optionCode = O.code AND
				M.tarificationCode = T.code AND
				Mo.tarificationCode = T.code AND
				Mo.formuleType = 'Journée' AND
				M.marque || ' ' || M.type = '" . $mod . "' AND
				O.code = '" . $opt . "' AND
				V.numero NOT IN (
					SELECT
						V.numero AS 'Numéro de véhicule'
					FROM Vehicule V, Reservation Res
					WHERE
						Res.vehiculeNumero = V.numero AND
						Res.etat = 'Effectif'
				) AND
				V.dateRestitution IS NULL
			;
			";
		}
		return $sql;
	}
?>

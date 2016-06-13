<?php
function tableSQL()
{
	$sql = "
CREATE TABLE IF NOT EXISTS Assureur (
	prenom TEXT NOT NULL,
	nom TEXT NOT NULL,
	adresse TEXT,
	telephone TEXT,
	fax TEXT,
	PRIMARY KEY (prenom, nom)
);

CREATE TABLE IF NOT EXISTS Assurance (
	type TEXT PRIMARY KEY NOT NULL,
	assureurPrenom TEXT,
	assureurNom TEXT,
	FOREIGN KEY (assureurPrenom, assureurNom) REFERENCES Assureur(prenom, nom)
);

CREATE TABLE IF NOT EXISTS Option (
	code TEXT PRIMARY KEY NOT NULL,
	libelle TEXT
);

CREATE TABLE IF NOT EXISTS Tarification (
	code TEXT PRIMARY KEY NOT NULL,
	assuranceType TEXT,
	prixKilometre REAL CHECK (prixKilometre > 0),
	amendeJournaliere REAL CHECK (amendeJournaliere > 0),
	FOREIGN KEY (assuranceType) REFERENCES Assurance(type)
);

CREATE TABLE IF NOT EXISTS Modele (
	marque TEXT NOT NULL,
	type TEXT NOT NULL,
	optionCode TEXT,
	tarificationCode TEXT,
	puissance REAL CHECK (puissance > 0),
	PRIMARY KEY (marque, type),
	FOREIGN KEY (optionCode) REFERENCES Option(code),
	FOREIGN KEY (tarificationCode) REFERENCES Tarification(code)
);

CREATE TABLE IF NOT EXISTS Vehicule (
	numero INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	modeleMarque TEXT,
	modeleType TEXT,
	dateAchat DATETIME,
	prixAchat REAL CHECK (prixAchat > 0),
	dateRestitution DATETIME,
	FOREIGN KEY (modeleMarque, modeleType) REFERENCES Modele(marque, type)
);

CREATE TABLE IF NOT EXISTS Formule (
	type TEXT PRIMARY KEY NOT NULL,
	kilometrageForfaitaire REAL CHECK (kilometrageForfaitaire > 0)
);

CREATE TABLE IF NOT EXISTS Montant (
	tarificationCode TEXT NOT NULL,
	formuleType TEXT NOT NULL,
	montantForfaitaire REAL CHECK (montantForfaitaire > 0),
	PRIMARY KEY (tarificationCode, formuleType),
	FOREIGN KEY (tarificationCode) REFERENCES Tarification(code),
	FOREIGN KEY (formuleType) REFERENCES Formule(type)
);

CREATE TABLE IF NOT EXISTS Client (
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	prenom TEXT,
	nom TEXT,
	adresse TEXT,
	telephone TEXT
);

CREATE TABLE IF NOT EXISTS Reservation (
	numero INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	formuleType TEXT,
	vehiculeNumero INTEGER,
	clientId INTEGER,
	dateEffectuee DATETIME,
	dateDemandee DATETIME CHECK (dateDemandee > dateEffectuee),
	disponibiliteReelle INTEGER CHECK (disponibiliteReelle BETWEEN 0 AND 1),
	etat TEXT,
	dateAnnulation DATETIME DEFAULT null,
	nouvelleReservationNumero INTEGER DEFAULT null,
	FOREIGN KEY (formuleType) REFERENCES Formule(type),
	FOREIGN KEY (vehiculeNumero) REFERENCES Vehicule(numero),
	FOREIGN KEY (clientId) REFERENCES Client(id),
	FOREIGN KEY (nouvelleReservationNumero) REFERENCES Reservation(numero)
);

CREATE TABLE IF NOT EXISTS Location (
	numeroContrat INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	reservationNumero INTEGER,
	kilometrageDepart REAL CHECK (kilometrageDepart > 0),
	dateDepart DATETIME,
	numeroPermis TEXT,
	paiementCaution INTEGER CHECK (paiementCaution BETWEEN 0 AND 1),
	FOREIGN KEY (reservationNumero) REFERENCES Reservation(numero)
);

CREATE TABLE IF NOT EXISTS Facture (
	numero INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	locationNumeroContrat INTEGER,
	FOREIGN KEY (locationNumeroContrat) REFERENCES Location(numeroContrat)
);

CREATE TABLE IF NOT EXISTS Reception (
	locationNumeroContrat INTEGER PRIMARY KEY NOT NULL,
	kilometrageArrivee REAL CHECK (kilometrageArrivee > 0),
	dateArrivee DATETIME,
	dommage TEXT,
	FOREIGN KEY (locationNumeroContrat) REFERENCES Location(numeroContrat)
);
	";
	return $sql;
}

function viewSQL()
{
	$sql = "
CREATE VIEW IF NOT EXISTS VFacture AS
SELECT
	Fa.numero AS factureNumero,
	L.numeroContrat AS numeroContrat,
	C.id AS clientId,
	Mon.montantForfaitaire AS montantBase,
	CASE
		WHEN L.paiementCaution = 0 THEN
			(Mon.montantForfaitaire / 100) * 3
		ELSE
			0
	END AS fraisPaiementCaution,
	CASE
		WHEN Fo.type = 'Journée' AND Rec.dateArrivee > datetime(L.dateDepart, '+1 days') THEN
			(julianday(Rec.dateArrivee, '+1 days', 'start of day') - julianday(L.dateDepart, '+1 days', 'start of day')) * T.amendeJournaliere
		WHEN Fo.type = 'Semaine' AND Rec.dateArrivee > datetime(L.dateDepart, '+1 weeks') THEN
			(julianday(Rec.dateArrivee, '+1 days', 'start of day') - julianday(L.dateDepart, '+1 weeks', 'start of day')) * T.amendeJournaliere
		WHEN Fo.type = 'Week-end' AND Rec.dateArrivee > datetime(L.dateDepart, '+3 days', 'start of day', '+7 hours', '+30 minutes') THEN
			(julianday(Rec.dateArrivee, '+1 days', 'start of day') - julianday(L.dateDepart, '+3 days', 'start of day')) * T.amendeJournaliere
		ELSE
			0
	END AS fraisJoursSupps,
	CASE
		WHEN Rec.kilometrageArrivee - L.kilometrageDepart > Fo.kilometrageForfaitaire THEN
			(Rec.kilometrageArrivee - L.kilometrageDepart - Fo.kilometrageForfaitaire) * T.prixKilometre
		ELSE
			0
	END AS fraisKmSupps,
	CASE
		WHEN EXISTS (SELECT R.numero FROM Reservation R WHERE R.nouvelleReservationNumero = Res.numero) THEN
			T.amendeJournaliere
		ELSE
			0
	END AS compensationAnnulation
FROM
	Client C,
	Facture Fa,
	Formule Fo,
	Location L,
	Montant Mon,
	Modele Mod,
	Reception Rec,
	Reservation Res,
	Tarification T,
	Vehicule V
WHERE
	Fa.locationNumeroContrat = L.numeroContrat AND
	Rec.locationNumeroContrat = L.numeroContrat AND
	L.reservationNumero = Res.numero AND
	Res.formuleType = Fo.type AND
	Res.vehiculeNumero = V.numero AND
	Res.clientId = C.id AND
	Mon.tarificationCode = T.code AND
	Mon.formuleType = Fo.type AND
	V.modeleMarque = Mod.marque AND
	V.modeleType = Mod.type AND
	Mod.tarificationCode = T.code
;
	";
	return $sql;
}

function insertSQL()
{
	$sql = "
INSERT OR REPLACE INTO Assureur (
	prenom,
	nom
) VALUES (
	'Jean-luc',
	'Durant'
);

INSERT OR REPLACE INTO Assureur (
	prenom,
	nom
) VALUES (
	'Michel',
	'Bubois'
);

INSERT OR REPLACE INTO Assureur (
	prenom,
	nom
) VALUES (
	'Charlène',
	'Mini'
);

INSERT OR REPLACE INTO Assurance (
	type,
	assureurPrenom,
	assureurNom
) VALUES (
	'Omnium',
	'Jean-luc',
	'Durant'
);

INSERT OR REPLACE INTO Assurance (
	type,
	assureurPrenom,
	assureurNom
) VALUES (
	'Au Kilomètre',
	'Jean-luc',
	'Durant'
);

INSERT OR REPLACE INTO Assurance (
	type,
	assureurPrenom,
	assureurNom
) VALUES (
	'Année',
	'Charlène',
	'Mini'
);

INSERT OR REPLACE INTO Assurance (
	type,
	assureurPrenom,
	assureurNom
) VALUES (
	'Au mois',
	'Michel',
	'Bubois'
);

INSERT OR REPLACE INTO Client (
	id,
	prenom,
	nom
) VALUES (
	1,
	'Bernad',
	'Duchêne'
);

INSERT OR REPLACE INTO Client (
	id,
	prenom,
	nom
) VALUES (
	2,
	'Monique',
	'Ale'
);

INSERT OR REPLACE INTO Option (
	Code,
	Libelle
) VALUES (
	'O1',
	'Break - 5 portes'
);

INSERT OR REPLACE INTO Option (
	Code,
	Libelle
) VALUES (
	'O2',
	'Berline - 5 portes'
);

INSERT OR REPLACE INTO Tarification (
	code,
	assuranceType,
	prixKilometre,
	amendeJournaliere
) VALUES (
	'T1',
	'Omnium',
	1,
	30
);

INSERT OR REPLACE INTO Tarification (
	code,
	assuranceType,
	prixKilometre,
	amendeJournaliere
) VALUES (
	'T2',
	'Au kilomètre',
	0.5,
	40.0
);

INSERT OR REPLACE INTO Modele (
	marque,
	type,
	optionCode,
	tarificationCode
) VALUES (
	'Audi',
	'A3',
	'O1',
	'T2'
);

INSERT OR REPLACE INTO Modele (
	marque,
	type,
	optionCode,
	tarificationCode
) VALUES (
	'BMW',
	'520',
	'O1',
	'T1'
);

INSERT OR REPLACE INTO Formule (
	type,
	kilometrageForfaitaire
) VALUES (
	'Journée',
	50
);

INSERT OR REPLACE INTO Formule (
	type,
	kilometrageForfaitaire
) VALUES (
	'Semaine',
	250
);

INSERT OR REPLACE INTO Formule (
	type,
	kilometrageForfaitaire
) VALUES (
	'Week-end',
	100
);

INSERT OR REPLACE INTO Montant (
	tarificationCode,
	formuleType,
	montantForfaitaire
) VALUES (
	'T1',
	'Journée',
	100
);

INSERT OR REPLACE INTO Montant (
	tarificationCode,
	formuleType,
	montantForfaitaire
) VALUES (
	'T2',
	'Journée',
	80
);

INSERT OR REPLACE INTO Montant (
	tarificationCode,
	formuleType,
	montantForfaitaire
) VALUES (
	'T1',
	'Semaine',
	500
);

INSERT OR REPLACE INTO Montant (
	tarificationCode,
	formuleType,
	montantForfaitaire
) VALUES (
	'T2',
	'Semaine',
	450
);

INSERT OR REPLACE INTO Montant (
	tarificationCode,
	formuleType,
	montantForfaitaire
) VALUES (
	'T1',
	'Week-end',
	160
);

INSERT OR REPLACE INTO Montant (
	tarificationCode,
	formuleType,
	montantForfaitaire
) VALUES (
	'T2',
	'Week-end',
	160
);

INSERT OR REPLACE INTO Vehicule (
	numero,
	modeleMarque,
	modeleType
) VALUES (
	1,
	'Audi',
	'A3'
);

INSERT OR REPLACE INTO Vehicule (
	numero,
	modeleMarque,
	modeleType
) VALUES (
	2,
	'Audi',
	'A3'
);

INSERT OR REPLACE INTO Vehicule (
	numero,
	modeleMarque,
	modeleType
) VALUES (
	3,
	'BMW',
	'520'
);

INSERT OR REPLACE INTO Reservation (
	numero,
	formuleType,
	vehiculeNumero,
	clientId,
	etat,
	dateAnnulation,
	nouvelleReservationNumero
) VALUES (
	1,
	'Journée',
	2,
	1,
	'Effectif',
	null,
	null
);

INSERT OR REPLACE INTO Reservation (
	numero,
	formuleType,
	vehiculeNumero,
	clientId,
	etat,
	dateAnnulation,
	nouvelleReservationNumero
) VALUES (
	2,
	'Journée',
	1,
	1,
	'Annulée',
	null,
	1
);

INSERT OR REPLACE INTO Reservation (
	numero,
	formuleType,
	vehiculeNumero,
	clientId,
	etat,
	dateAnnulation,
	nouvelleReservationNumero
) VALUES (
	3,
	'Semaine',
	3,
	2,
	'Supprimée',
	20/03/2016,
	null
);

INSERT OR REPLACE INTO Reservation (
	numero,
	formuleType,
	vehiculeNumero,
	clientId,
	etat,
	dateAnnulation,
	nouvelleReservationNumero
) VALUES (
	4,
	'Week-end',
	3,
	1,
	'Terminée',
	null,
	null
);

INSERT OR REPLACE INTO Reservation (
	numero,
	formuleType,
	vehiculeNumero,
	clientId,
	etat,
	dateAnnulation,
	nouvelleReservationNumero
) VALUES (
	5,
	'Journée',
	2,
	1,
	'Terminée',
	null,
	null
);

INSERT OR REPLACE INTO Location (
	numeroContrat,
	reservationNumero,
	kilometrageDepart,
	dateDepart,
	paiementCaution
) VALUES (
	1,
	1,
	20000,
	'2016-03-10 17:00',
	1
);

INSERT OR REPLACE INTO Location (
	numeroContrat,
	reservationNumero,
	kilometrageDepart,
	dateDepart,
	paiementCaution
) VALUES (
	2,
	4,
	50000,
	'2016-03-16 20:00',
	0
);

INSERT OR REPLACE INTO Location (
	numeroContrat,
	reservationNumero,
	kilometrageDepart,
	dateDepart,
	paiementCaution
) VALUES (
	3,
	5,
	18000,
	'2016-03-18 11:00',
	1
);

INSERT OR REPLACE INTO Reception (
	locationNumeroContrat,
	kilometrageArrivee,
	dateArrivee
) VALUES (
	1,
	20050,
	'2016-03-19 09:00'
);

INSERT OR REPLACE INTO Reception (
	locationNumeroContrat,
	kilometrageArrivee,
	dateArrivee
) VALUES (
	2,
	50050,
	'2016-03-20 17:00'
);

INSERT OR REPLACE INTO Reception (
	locationNumeroContrat,
	kilometrageArrivee,
	dateArrivee
) VALUES (
	3,
	20050,
	'2016-03-28 14:00'
);

INSERT OR REPLACE INTO Facture (
	numero,
	locationNumeroContrat
) VALUES (
	1,
	1
);

INSERT OR REPLACE INTO Facture (
	numero,
	locationNumeroContrat
) VALUES (
	2,
	2
);

INSERT OR REPLACE INTO Facture (
	numero,
	locationNumeroContrat
) VALUES (
	3,
	3
);
	";
	return $sql;;
}

?>

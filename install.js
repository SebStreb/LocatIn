'use strict';

var sql = require('mysql');

var user = require('./database/user.js');
var assureur = require('./database/tables/assureur.js');
var assurance = require('./database/tables/assurance.js');
var option = require('./database/tables/option.js');
var tarification = require('./database/tables/tarification.js');
var modele = require('./database/tables/modele.js');
var vehicule = require('./database/tables/vehicule.js');
var formule = require('./database/tables/formule.js');
var montant = require('./database/tables/montant.js');
var client = require('./database/tables/client.js');
var reservation = require('./database/tables/reservation.js');
var location = require('./database/tables/location.js');
var facture = require('./database/tables/facture.js');
var reception = require('./database/tables/reception.js');
var view = require('./database/view.js');

var nbinserted = 0;

var today = new Date();
var tomorow = new Date();
tomorow.setDate(today.getDate() + 1);
var befTomorow = new Date();
befTomorow.setHours(today.getHours() + 28);

var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root'
});
connection.connect(function(err) {
    if (err) console.error('CONNECT ERROR : ' + err.code);
});
connection.query("DROP DATABASE LocatIn", function (err) {
    if (err) console.error('DROP DATABASE : ' + err.code);
});
connection.query("CREATE DATABASE LocatIn", function (err) {
    if (err) console.error('CREATE DATABASE : ' + err.code);
});
connection.end();

setTimeout(function () {
    user.create();
    assureur.create();
    assurance.create();
    option.create();
    tarification.create();
    modele.create();
    vehicule.create();
    formule.create();
    montant.create();
    client.create();
    reservation.create();
    location.create();
    facture.create();
    reception.create();
    view.create();

    user.insert({username: 'admin', password: 'tux'}, function () {
        nbinserted++;
    });
    user.insert({username: 'SebStreb', password: 'Yolo1234'}, function () {
        nbinserted++;
    });

    assureur.insert({prenom: 'Jean-Luc', nom: 'Durant'}, function () {
        nbinserted++;
    });
    assureur.insert({prenom: 'Michel', nom: 'Dubois'}, function () {
        nbinserted++;
    });

    assurance.insert({type: 'Omnium', assureurPrenom: 'Jean-Luc', assureurNom: 'Durant'}, function () {
        nbinserted++;
    });
    assurance.insert({type: 'Kilométrage', assureurPrenom: 'Jean-Luc', assureurNom: 'Durant'}, function () {
        nbinserted++;
    });
    assurance.insert({type: 'Annuelle', assureurPrenom: 'Michel', assureurNom: 'Dubois'}, function () {
        nbinserted++;
    });

    option.insert({code: 'O1', libelle: 'Break - 5 portes'}, function () {
        nbinserted++;
    });
    option.insert({code: 'O2', libelle: 'Berline - 5 portes'}, function () {
        nbinserted++;
    });

    tarification.insert({code: 'T1', assuranceType: 'Omnium', prixKilometre: 1, amendeJournaliere: 30}, function () {
        nbinserted++;
    });
    tarification.insert({code: 'T2', assuranceType: 'Kilométrage', prixKilometre: 0.5, amendeJournaliere: 40}, function () {
        nbinserted++;
    });

    modele.insert({marque: 'Audi', type: 'A3', optionCode: 'O1', tarificationCode: 'T2'}, function () {
        nbinserted++;
    });
    modele.insert({marque: 'BMW', type: '520', optionCode: 'O1', tarificationCode: 'T1'}, function () {
        nbinserted++;
    });

    vehicule.insert({modeleMarque: 'Audi', modeleType: 'A3'}, function () {
        nbinserted++;
    });
    vehicule.insert({modeleMarque: 'Audi', modeleType: 'A3'}, function () {
        nbinserted++;
    });
    vehicule.insert({modeleMarque: 'BMW', modeleType: '520'}, function () {
        nbinserted++;
    });

    formule.insert({type: 'Journée', kilometrageForfaitaire: 50}, function () {
        nbinserted++;
    });
    formule.insert({type: 'Semaine', kilometrageForfaitaire: 250}, function () {
        nbinserted++;
    });
    formule.insert({type: 'Week-end', kilometrageForfaitaire: 100}, function () {
        nbinserted++;
    });

    montant.insert({tarificationCode: 'T1', formuleType: 'Journée', montantForfaitaire: 100}, function () {
        nbinserted++;
    });
    montant.insert({tarificationCode: 'T2', formuleType: 'Journée', montantForfaitaire: 80}, function () {
        nbinserted++;
    });
    montant.insert({tarificationCode: 'T1', formuleType: 'Semaine', montantForfaitaire: 500}, function () {
        nbinserted++;
    });
    montant.insert({tarificationCode: 'T2', formuleType: 'Semaine', montantForfaitaire: 450}, function () {
        nbinserted++;
    });
    montant.insert({tarificationCode: 'T1', formuleType: 'Week-end', montantForfaitaire: 160}, function () {
        nbinserted++;
    });
    montant.insert({tarificationCode: 'T2', formuleType: 'Week-end', montantForfaitaire: 160}, function () {
        nbinserted++;
    });

    client.insert({prenom: 'Bernard', nom: 'Duchêne'}, function () {
        nbinserted++;
    });
    client.insert({prenom: 'Monique', nom: 'Ale'}, function () {
        nbinserted++;
    });

    reservation.insert({formuleType: 'Journée', vehiculeNumero: 1, clientId: 1, etat: 'Effectif', dateAnnulation: null, nouvelleReservationNumero: null}, function () {
        nbinserted++;
    });
    reservation.insert({formuleType: 'Journée', vehiculeNumero: 2, clientId: 1, etat: 'Effectif', dateAnnulation: null, nouvelleReservationNumero: null}, function () {
        nbinserted++;
    });
    reservation.insert({formuleType: 'Semaine', vehiculeNumero: 3, clientId: 2, etat: 'Supprimée', dateAnnulation: tomorow, nouvelleReservationNumero: null}, function () {
        nbinserted++;
    });
    reservation.insert({formuleType: 'Week-end', vehiculeNumero: 3, clientId: 1, etat: 'Terminée', dateAnnulation: null, nouvelleReservationNumero: null}, function () {
        nbinserted++;
    });
    reservation.insert({formuleType: 'Journée', vehiculeNumero: 2, clientId: 1, etat: 'Terminée', dateAnnulation: null, nouvelleReservationNumero: null}, function () {
        nbinserted++;
    });
    reservation.update({numero: 1}, {etat: 'Annulée', nouvelleReservationNumero: 5}, function () {
        nbinserted++;
    });

    location.insert({reservationNumero: 2, kilometrageDepart: 20000, dateDepart: today, paiementCaution: 1}, function () {
        nbinserted++;
    });
    location.insert({reservationNumero: 4, kilometrageDepart: 50000, dateDepart: today, paiementCaution: 0}, function () {
        nbinserted++;
    });
    location.insert({reservationNumero: 5, kilometrageDepart: 18000, dateDepart: today, paiementCaution: 1}, function () {
        nbinserted++;
    });

    reception.insert({locationNumeroContrat: 2, kilometrageArrivee: 50050, dateArrivee: tomorow}, function () {
        nbinserted++;
    });
    reception.insert({locationNumeroContrat: 3, kilometrageArrivee: 20050, dateArrivee: befTomorow}, function () {
        nbinserted++;
    });

    facture.insert({locationNumeroContrat: 2}, function () {
        nbinserted++;
    });
    facture.insert({locationNumeroContrat: 3}, function () {
        nbinserted++;
        if (nbinserted === 40) process.exit(0);
    });
}, 2000);

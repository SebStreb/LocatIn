var user = require('./database/tables/user.js');
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
var view = require('./database/tables/view.js');

var today = new Date();

user.destroy();
assureur.destroy();
assurance.destroy();
option.destroy();
tarification.destroy();
modele.destroy();
vehicule.destroy();
formule.destroy();
montant.destroy();
client.destroy();
reservation.destroy();
location.destroy();
facture.destroy();
reception.destroy();
view.destroy();
console.log('Tables destroyed');

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
console.log('Tables recreated');

user.insert({$username: 'admin', $password: 'tux'});
user.insert({$username: 'SebStreb', $password: 'Yolo1234'});

assureur.insert({$prenom: 'Jean-Luc', $nom: 'Durant'});
assureur.insert({$prenom: 'Michel', $nom: 'Dubois'});

assurance.insert({$type: 'Omnium', $assureurPrenom: 'Jean-Luc', $assureurNom: 'Durant'});
assurance.insert({$type: 'Kilométrage', $assureurPrenom: 'Jean-Luc', $assureurNom: 'Durant'});
assurance.insert({$type: 'Annuelle', $assureurPrenom: 'Michel', $assureurNom: 'Dubois'});

option.insert({$code: 'O1', $libelle: 'Break - 5 portes'});
option.insert({$code: 'O2', $libelle: 'Berlines - 5 portes'});

tarification.insert({$code: 'T1', $assuranceType: 'Omnium', $prixKilometre: 1, $amendeJournaliere: 30});
tarification.insert({$code: 'T2', $assuranceType: 'Kilométrage', $prixKilometre: 0.5, $amendeJournaliere: 40});

modele.insert({$marque: 'Audi', $type: 'A3', $optionCode: 'O1', $tarificationCode: 'T2'});
modele.insert({$marque: 'BMW', $type: '520', $optionCode: 'O1', $tarificationCode: 'T1'});

vehicule.insert({$modeleMarque: 'Audi', $modeleType: 'A3'});
vehicule.insert({$modeleMarque: 'Audi', $modeleType: 'A3'});
vehicule.insert({$modeleMarque: 'BMW', $modeleType: '520'});

formule.insert({$type: 'Journée', $kilometrageForfaitaire: 50});
formule.insert({$type: 'Semaine', $kilometrageForfaitaire: 250});
formule.insert({$type: 'Week-end', $kilometrageForfaitaire: 100});

montant.insert({$tarificationCode: 'T1', $formuleType: 'Journée', $montantForfaitaire: 100});
montant.insert({$tarificationCode: 'T2', $formuleType: 'Journée', $montantForfaitaire: 80});
montant.insert({$tarificationCode: 'T1', $formuleType: 'Semaine', $montantForfaitaire: 500});
montant.insert({$tarificationCode: 'T2', $formuleType: 'Journée', $montantForfaitaire: 450});
montant.insert({$tarificationCode: 'T1', $formuleType: 'Week-end', $montantForfaitaire: 160});
montant.insert({$tarificationCode: 'T1', $formuleType: 'Week-end', $montantForfaitaire: 160});

client.insert({$prenom: 'Bernard', $nom: 'Duchêne'});
client.insert({$prenom: 'Monique', $nom: 'Ale'});

reservation.insert({$formuleType: 'Journée', $vehiculeNumero: 1, $clientId: 1, $etat: 'Annulée', $dateAnnulation: null, $nouvelleReservationNumero: 2});
reservation.insert({$formuleType: 'Journée', $vehiculeNumero: 2, $clientId: 1, $etat: 'Effectif', $dateAnnulation: null, $nouvelleReservationNumero: null});
reservation.insert({$formuleType: 'Semaine', $vehiculeNumero: 3, $clientId: 2, $etat: 'Supprimée', $dateAnnulation: new Date(today.getTime()+1000*60*60*24), $nouvelleReservationNumero: null});
reservation.insert({$formuleType: 'Week-end', $vehiculeNumero: 3, $clientId: 1, $etat: 'Terminée', $dateAnnulation: null, $nouvelleReservationNumero: null});
reservation.insert({$formuleType: 'Journée', $vehiculeNumero: 2, $clientId: 1, $etat: 'Terminée', $dateAnnulation: null, $nouvelleReservationNumero: null});

location.insert({$reservationNumero: 2, $kilometrageDepart: 20000, $dateDepart: today, $paiementCaution: 1});
location.insert({$reservationNumero: 4, $kilometrageDepart: 50000, $dateDepart: today, $paiementCaution: 0});
location.insert({$reservationNumero: 5, $kilometrageDepart: 18000, $dateDepart: today, $paiementCaution: 1});

reception.insert({$locationNumeroContrat: 2, $kilometrageArrivee: 50050, $dateArrivee: new Date(today.getTime()+1000*60*60*24*3)});
reception.insert({$locationNumeroContrat: 3, $kilometrageArrivee: 20050, $dateArrivee: new Date(today.getTime()+1000*60*60*24*0.8)});

facture.insert({$locationNumeroContrat: 2});
facture.insert({$locationNumeroContrat: 3});
console.log('Values inserted');

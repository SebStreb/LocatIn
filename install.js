var sqlite3 = require('sqlite3').verbose();
console.log('\n\n\n');
var db = new sqlite3.Database('bdd.sqlite');
var user = require('./database/user.js');

db.serialize(function() {
	user.destroy();
	user.create();
	user.insert({$username: 'SebStreb', $password: 'Yolo1234'});
});

db.close();

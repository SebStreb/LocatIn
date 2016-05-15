var user = require('./database/user.js');
var option = require('./database/option.js');

user.destroy();
option.destroy();
console.log('Tables destroyed');

user.create();
option.create();
console.log('Tables recreated');

user.insert({$username: 'SebStreb', $password: 'Yolo1234'});
option.insert({$code: '01', $libelle: 'Break - 5 portes'});
console.log('Values inserted');

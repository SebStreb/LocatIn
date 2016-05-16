'use strict';

var mysql = require('mysql');
var user = require('./database/user');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root'
});
connection.connect(function(err) {
	if (err) console.error('CONNECT ERROR : ' + err.code);
});
connection.query("CREATE DATABASE IF NOT EXISTS LocatIn", function (err) {
	if (err) console.error('CREATE DATABASE : ' + err.code);
});
connection.end();

user.destroy();
user.create();
user.insert({username: 'SebStreb', password: 'Yolo1234'});

'use strict';

var mysql = require('./connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS User(" +
			"id INT PRIMARY KEY AUTO_INCREMENT NOT NULL," +
			"username VARCHAR(20) UNIQUE NOT NULL," +
			"password VARCHAR(20) NOT NULL" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE USER : ' + err.code);
		});
	});
};

exports.insert = function (user) {
	mysql(function (connection) {
		var sql =
		"INSERT IGNORE INTO User(username, password) VALUES(:username, :password)";
		connection.query(sql, user, function (err) {
			if (err) console.error('INSERT USER : ' + err.code);
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS User";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY USER : ' + err.code);
		});
	});
};

exports.findPassport = function (user, callback) {
	mysql(function (connection) {
		if (user.id)
			var sql = "SELECT id, username, password FROM User WHERE id = :id";
		else
			var sql = "SELECT id, username, password FROM User WHERE username = :username";
		connection.query(sql, user, function (err, result) {
			if (err) console.error('FIND USER : ' + err.code);
			if (result.length == 0) return callback(err, undefined);
			var user = {
				id: result[0].id,
				login: result[0].username,
				validPassword: function(password) {
					return password == result[0].password;
				}
			};
			callback(err, user);
		});
	});
};

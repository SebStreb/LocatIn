'use strict';

var mysql = require('./connect.js');

exports.create = function () {
	mysql(function (connection) {
		var sql =
		"CREATE TABLE IF NOT EXISTS User(\n" +
			"id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,\n" +
			"username VARCHAR(20) UNIQUE NOT NULL,\n" +
			"password VARCHAR(20) NOT NULL\n" +
		")";
		connection.query(sql, function (err) {
			if (err) console.error('CREATE USER : ' + err.message);
		});
	});
};

exports.exec = function (sql, callback) {
	mysql(function (connection) {
		connection.query(sql, function (err, result, field) {
			if (err) console.error('EXEC : ' + err.message);
			callback(result, field, err);
		})
	});
};

exports.insert = function (user) {
	mysql(function (connection) {
		var sql =
		"INSERT IGNORE INTO User(username, password) \n" +
		"VALUES(:username, :password)";
		connection.query(sql, user, function (err, result) {
			if (err) console.error('INSERT USER : ' + err.message);
			console.log('INSERTED ID ' + result.insertId + ' IN USER');
		});
	});
};

exports.destroy = function () {
	mysql(function (connection) {
		var sql = "DROP TABLE IF EXISTS User";
		connection.query(sql, function (err) {
			if (err) console.error('DESTROY USER : ' + err.message);
		});
	});
};

exports.findPassport = function (user, callback) {
	mysql(function (connection) {
		var sql = "SELECT id, username, password FROM User WHERE username = :username";
		connection.query(sql, user, function (err, result) {
			if (err) console.error('FIND USER : ' + err.message);
			if (result.length == 0) return callback(err, undefined);
			var user = {
				id: result[0].id,
				username: result[0].username,
				validPassword: function(password) {
					return password == result[0].password;
				}
			};
			callback(err, user);
		});
	});
};

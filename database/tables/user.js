var sqlite3 = require('sqlite3').verbose();
console.log('\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql =
		"CREATE TABLE IF NOT EXISTS User(" +
			"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
			"username TEXT UNIQUE NOT NULL," +
			"password TEXT NOT NULL" +
		")";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.insert = function (user) {
	var sql = "INSERT OR IGNORE INTO User(username, password) VALUES($username, $password)";
	db.serialize(function () {
		db.run(sql, user, function(err) {
			if (err) console.log(err);
		});
	});
};

exports.update = function (find, replace) {
	if (find.$id && replace.$username && replace.$password) {
		var sql = "UPDATE User SET username = $username, password = $password WHERE id = $id";
		var user = {$username: replace.$username, $password: replace.$password, $id: find.$id};
	} else if (find.$id && replace.$username) {
		var sql = "UPDATE User SET username = $username WHERE id = $id";
		var user = {$username: replace.$username, $id: find.$id};
	} else if (find.$id && replace.$password) {
		var sql = "UPDATE User SET password = $password WHERE id = $id";
		var user = {$password: replace.$password, $id: find.$id};
	} else {
		var sql = "UPDATE User SET password = $password WHERE username = $username";
		var user = {$password: replace.$password, $username: find.$username};
	}
	db.run(sql, user, function(err) {
		if (err) console.log(err);
	});
};

exports.find = function (user, callback) {
	if (user.$id)
		var sql = "SELECT id, username, password FROM User WHERE id = $id";
	else
		var sql = "SELECT id, username, password FROM User WHERE username = $username";
	db.get(sql, user, function(err, row) {
		if (err) console.log(err);
		if (!row) return callback(undefined);
		callback(row);
	});
};

exports.findPassport = function (user, callback) {
	if (user.$id)
		var sql = "SELECT id, username, password FROM User WHERE id = $id";
	else
		var sql = "SELECT id, username, password FROM User WHERE username = $username";
	db.get(sql, user, function(err, row) {
		if (err) console.log(err);
		if (!row) return callback(err, undefined);
		var usr = {
			id: row.id,
			login: row.username,
			validPassword: function(password) {
				return password == row.password;
			}
		};
		callback(err, usr);
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS User";
	db.serialize(function () {
		db.run(sql, function(err) {
			if (err) console.log(err);
		});
	});
};

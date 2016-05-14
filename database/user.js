var sqlite3 = require('sqlite3').verbose();
console.log('\n\n\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql = "CREATE TABLE IF NOT EXISTS User(" +
		"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
		"username TEXT NOT NULL," +
		"password TEXT NOT NULL)";
	db.run(sql, function(err) {
		if (err) console.log(err);
		console.log('BDD recreated');
	});
};

exports.insert = function (user) {
	var sql = "INSERT OR IGNORE INTO User(username, password) VALUES($username, $password)";
	db.run(sql, user, function(err) {
		if (err) console.log(err);
		console.log('Values inserted');
	});
};

exports.find = function (user, callback) {
	var sql;
	if (user.$id) {
		sql = "SELECT id, username, password FROM User WHERE id = $id";
	} else {
		sql = "SELECT id, username, password FROM User WHERE username = $username";
	}
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
	})
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS User";
	db.run(sql, function(err) {
		if (err) console.log(err);
		console.log('BDD dropped');
	});
};

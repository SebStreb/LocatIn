exports.create = function (db) {
	var sql = "CREATE TABLE IF NOT EXISTS User(" +
		"login TEXT PRIMARY KEY NOT NULL, " +
		"pass TEXT)";
	db.run(sql, function(err) {
		if (err) console.log(err);
	});
};

exports.insert = function (db, user) {
	var sql = "INSERT OR IGNORE INTO User VALUES($login, $pass)";
	db.run(sql, user, function(err) {
		if (err) console.log(err);
	});
};

exports.find = function (db, user, callback) {
	var sql = "SELECT * FROM User WHERE login = $login AND pass = $pass";
	db.get(sql, user, function(err, row) {
		if (err) console.log(err);
		callback(row);
	})
};

exports.destroy = function (db) {
	var sql = "DROP TABLE User";
	db.run(sql, function(err) {
		if (err) console.log(err);
	});
};

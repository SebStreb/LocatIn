var sqlite3 = require('sqlite3').verbose();
console.log('\n\n\n');
var db = new sqlite3.Database('bdd.sqlite');

exports.create = function () {
	var sql = "CREATE TABLE IF NOT EXISTS Option(" +
		"code TEXT PRIMARY KEY NOT NULL," +
		"libelle TEXT NOT NULL)";
	db.run(sql, function(err) {
		if (err) console.log(err);
	});
};

exports.insert = function (option) {
	var sql = "INSERT OR IGNORE INTO Option(code, libelle) VALUES($code, $libelle)";
	db.run(sql, option, function(err) {
		if (err) console.log(err);
	});
};

exports.update = function (find, replace) {
	var sql = "UPDATE Option SET libelle = $libelle WHERE code = $code";
	var option = {$libelle: replace.$libelle, $code: find.$code};
	db.run(sql, option, function(err) {
		if (err) console.log(err);
	});
};

exports.find = function (option, callback) {
	var sql = "SELECT code, libelle FROM Option WHERE code = $code";
	db.get(sql, option, function(err, row) {
		if (err) console.log(err);
		if (!row) return callback(undefined);
		callback(row);
	});
};

exports.findAll = function (option, callback) {
	var sql = "SELECT code, libelle FROM Option WHERE code = $code";
	db.all(sql, option, function(err, rows) {
		if (err) console.log(err);
		if (rows.lenght === 0) callback(undefined);
		callback(rows);
	});
};

exports.destroy = function () {
	var sql = "DROP TABLE IF EXISTS Option";
	db.run(sql, function(err) {
		if (err) console.log(err);
	});
};

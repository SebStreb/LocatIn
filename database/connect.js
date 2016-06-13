'use strict';

var mysql = require('mysql');

var pool  = mysql.createPool({
	host     : 'localhost',
	user     : 'b1bb440ebb3969',
	password : '74aea619',
	database : 'LocatIn',
	connectionLimit: 1
});

var launch = function(callback) {
	pool.getConnection(function(err, connection) {
		if (err) console.error('CONNECT ERROR : ' + err.message);
		else {
			connection.config.queryFormat = function (query, values) {
				if (!values) return query;
				return query.replace(/\:(\w+)/g, function (txt, key) {
					if (values.hasOwnProperty(key))
						return this.escape(values[key]);
					return txt;
				}.bind(this));
			};
			callback(connection);
		}
		connection.release();
	});
};

module.exports = launch;

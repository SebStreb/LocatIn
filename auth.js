'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('node-mysql-helper');
var user = require('./database/user.js');

module.exports = function() {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		user.findPassport({id: id}, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			user.findPassport({username: username}, function (err, user) {
				if (err) return done(err);
				if (!user) return done(null, false, {message: 'User not found'});
				if (!user.validPassword(password))
					return done(null, false, {message: 'Invalid Password'});
				return done(null, user);
			});
		}
	));
};

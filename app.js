'use strict';

var express = require('express');
var morgan = require('morgan');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var auth = require('./auth.js');

var index = require('./routes/index.js');
var client = require('./routes/client.js');
var reports = require('./routes/reports.js');
var management = require('./routes/management.js');

var app = express();
app.set('views', './public/views');
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
auth();

app.use('/', index);
app.use('/client', client);
app.use('/reports', reports);
app.use('/management', management);

// Handle 404
app.use(function(req, res) {
	res.status(404);
    if (req.session.passport)
		res.render('404', {title: '404', user: req.session.passport.user});
	else
		res.render('404', {title: '404'});
});

// Handle 500
app.use(function(error, req, res, next) {
	res.status(500);
    if (req.session.passport)
		res.render('500', {title: '500', error: error, user: req.session.passport.user});
	else
		res.render('500', {title: '500', error: error});
});

console.log('Server listening on port 3000');
app.listen(3000);

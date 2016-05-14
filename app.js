var express = require('express');
var morgan = require('morgan');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var auth = require('./auth.js');

var index = require('./routes/index.js');

var app = express();
app.set('views', './public/views')
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
auth();

app.use('/', index);

// Handle 404
app.use(function(req, res) {
	console.log(req.session.passport);
	res.status(404);
 	res.render('404', {title: '404'});
});

// Handle 500
app.use(function(error, req, res, next) {
	console.log(req.session.passport);
	res.status(500);
	res.render('500', {title: '500', error: error});
});

console.log('Server listening on port 3000');
app.listen(3000);

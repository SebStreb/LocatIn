var express = require('express');
var morgan = require('morgan');

var index = require('./routes/index.js');

var app = express();
app.set('views', './views')
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use('/', index);

// Handle 404
app.use(function(req, res) {
	res.status(404);
 	res.render('404', {title: '404'});
});

// Handle 500
app.use(function(error, req, res, next) {
	res.status(500);
	res.render('500', {title: '500', error: error});
});

app.listen(3000);

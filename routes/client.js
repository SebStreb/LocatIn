var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	if (!req.session.passport)
		res.render('index', {title: 'Index', rel: 'Home'});
	next();
})

router.get('/', function(req, res) {
	console.log(req.session.passport);
	res.render('client/index', {title: 'Client', rel: 'Client', user: req.session.passport.user});
});

module.exports = router;

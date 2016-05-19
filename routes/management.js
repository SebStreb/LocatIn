var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	if (req.session.passport) {
		if (!req.session.passport.user)
			res.redirect('/');
		else
			next();
	} else
		res.redirect('/');
});

router.get('/', function(req, res) {
	console.log(req.session.passport);
	res.render('management/index', {title: 'Management', rel: 'Management', user: req.session.passport.user});
});

module.exports = router;

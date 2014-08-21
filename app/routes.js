// app/routes.js
var User       		= require('../app/models/user');
var Account		= require('../app/models/account');
module.exports = function(app, passport, path) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/home', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});
/*
	app.get('/angapp', function(req, res) {
	  	res.sendfile(__dirname + '/angapp/index.html');
	});
*/
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
//		res.render('login.ejs', { message: req.flash('loginMessage') }); 
		res.json({message: req.flash('loginMessage') });
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.json({message: req.flash('signupMessage') });
	});

	// process the signup form
	// app.post('/signup', do all our passport stuff here);
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// New Account Creation
	app.post('/accountsetup', function(req, res) {
		var newAccount = new Account();
		newAccount.accountName = req.query.accountName;
		newAccount.accountEmail = req.query.accountEmail;
		newAccount.accountAdminName = req.query.accountAdminName;
		newAccount.accountPermissions = req.query.accountPermissions;	

		newAccount.save(function(err) {
			if (err) {
				res.json({'error': 'Unable to create new account'});
			}
			else {
				res.json({'account': newAccount});
			}
		});
		
	});

	app.post('/accountupdate', function(req, res) {
		Account.findOne({_id: req.query.id}, function(err, acct) {
			acct.permissions = req.query.permissions;
			acct.save();
			res.json({'account': acct});
		});
	});

	app.post('/accountbyid', function(req, res) {
		Account.findOne({_id: req.query.id}, function(err, acct) {
			res.json({'account': acct});
		});
	});

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
/*
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
*/
		res.json({user: req.user});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.json({'loggedOut': true});
	});

	app.post('/billingupdate', function(req, res) {
		var field;
		Account.findOne({_id: req._id}, function(err, acct) {
			for (field in req) {
				acct[field] = req[field];
			} 
			acct.save();
			res.json({'account': acct});
		});
	});

	// Update user
	app.post('/update', function(req, res) {
		var field;
		User.findOne({_id: req.user._id}, function(err, user) {
			for (field in user.local) {
				if (req.query[field] && field !== 'password') {
					user.local[field] = req.query[field];
				}
				else if (field == 'password') {
					if (req.query['password'] !== user.local.password) {
						user.local.password = user.generateHash(req.query['password']);
					}
				}
			} 
			user.save();
			res.json({'user': user});
		});
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.json({'error': 'Not logged in'});
}



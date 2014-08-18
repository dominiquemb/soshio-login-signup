var loginApp = angular.module('loginApp', ['ui.router', 'ivpusic.cookie'])
    .config(function ($stateProvider, $urlRouterProvider) {
	    $urlRouterProvider.otherwise('/login');	    
	    $stateProvider
	    .state('login', {
		    url: "/login",
		    templateUrl: "views/login/login.html",
		    controller: "LoginController"
	    })
	    .state('signup', {
		    url: "/signup",
		    templateUrl: "views/signup/signup.html",
		    controller: "SignupController"
	    })
	    .state('signup.contactinfo', {
		    url: "/contactinfo",
		    templateUrl: "views/signup/contactinfo.html"
	    })
	    .state('account', {
		    url: "/account",
		    templateUrl: "views/account/account.html",
		    controller: "AccountController"
	    })
	    .state('account.accountsetup', {
		    url: "/accountsetup",
		    templateUrl: "views/account/accountsetup.html"
	    })
	    .state('account.plans', {
		    url: "/plans",
		    templateUrl: "views/account/planpayment.html"
	    })
	    .state('account.userinformation', {
		    url: "/user-information",
		    templateUrl: "views/account/userinformation.html",
	    })
	    .state('account.edituserprofile', {
		    url: "/edit-user-profile",
		    templateUrl: "views/account/edituserprofile.html",
	    })
	    .state('account.snapshot', {
		    url: "/snapshot",
		    templateUrl: "views/account/accountsnapshot.html",
	    });
    });

loginApp.service('LoginService', function($http, ipCookie) {
	return {
		user: false,
		getAccountById: function(id, callback) {
			$http({
				method: 'POST',
				params: {
					id: id
				},
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/accountbyid'
			}).
			success(function(data, status, headers, config) {
				if (callback) {
					callback(data, status, headers, config);
				}
			});
		},
		newUser: function(user, callback) {
			var params = jQuery.extend(true, {}, user);
			params.password = CryptoJS.SHA3(user.password);
/*
			var amtArray = $scope.signup.planFee.split('.'),
			centAmt = Math.round(parseInt(amtArray[0]*100)) + parseInt(amtArray[1]);

			Stripe.setPublishableKey($scope.publicStripeApiKeyTesting);

			Stripe.card.createToken({
				number: $scope.cardInfo.cardNumber,
				cvc: $scope.cardInfo.cardSecNumber,
				exp_month: parseInt($scope.cardInfo.cardExpiryMonth),
				exp_year: $scope.cardInfo.cardExpiryYear,
			}, centAmt);

			$http({
				method: 'POST',
				params: {
					token: $scope.signup.token,
					centAmt: centAmt,
					email: $scope.signup.email
				},
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/payment'
			}).
			success(function(data) {
				if (data.error) {
					// replace this with something else later
					console.log(data.error);
				}
				else {
				}
			});
*/
			$http({
				method: 'POST', 
				params: params,
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/signup'
			}).
			success(function(data, status, headers, config) {
				if (callback) {
					callback(data, status, headers, config);
				}
			});
		},
		addAccountUser: function(data, callback) {
			if (data.account && data.user) {
				var permissions = {};
				angular.forEach(data.user.local.permissions, function(acct) {
					parsedAcct = JSON.parse(acct);
					if (parsedAcct.id === data.account.id) {
						permissions = {
							id: data.user._id,
							perms: parsedAcct.perms,
							firstName: data.user.local.firstName,
							lastName: data.user.local.lastName,
							email: data.user.local.email
						};
					}
				});

				if (!(data.account.permissions instanceof Array)) {
					data.account.permissions = [permissions];
				}
				else {
					data.account.permissions.push(permissions);
				}

				$http({
					method: 'POST', 
					params: data.account,
					url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/accountupdate'
				}).
				success(function(data, status, headers, config) {
					if (callback) {
						callback(data, status, headers, config);
					}
				});
			}
		},
		newAccount: function(params, callback) {
			$http({
				method: 'POST',
				params: params,
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/accountsetup'
			}).
			success(function(data, status, headers, config) {
				if (callback) {
					callback(data, status, headers, config);
				}
			});
		},
		update: function(params, callback) {
			$http({
				method: 'POST',
				params: params,
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/update'
			}).
			success(function(data, status, headers, config) {
				if (callback) {
					callback(data, status, headers, config);
				}
			});
		},
               	login: function(token, rememberMe, user) {
                        this.isLoggedIn = true;
                        if (rememberMe) {
                                ipCookie(
                                        'soshioSession',
                                        JSON.stringify({
						'session': token,
						'rememberMe': rememberMe
                                        }),
                                        {expires: 7}
                                );
                        }
                        else {
                                ipCookie(
                                        'soshioSession',
                                        JSON.stringify({
                                                'session': token,
						'rememberMe': rememberMe
                                        }),
                                        {expires: 1}
                                );
                        }
			this.user = user;
                },
                logOut: function($state, stayOnPage) {
			$http({
				method: 'GET',
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/logout'
			}).
			success(function(data, status, headers, config) {
				if (data.loggedOut) {
					if (!stayOnPage) {
						$state.go('login');
					}
					ipCookie.remove('soshioSession');
					document.execCommand("ClearAuthenticationCache");
				}
			});
                },
		getUser: function(callback) {
			$http({
				method: 'GET',
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/profile'
			}).
			success(function(data, status, headers, config) {
				if (callback) {
					callback(data);
				}
			});
		},
                confirmLoggedIn: function($state) {
                        if (ipCookie('soshioSession') === undefined) {
                                $state.go('login');
                                return false;
                        }
                        return true;
                }
	}

});

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

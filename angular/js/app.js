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
	    .state('signup.accountsetup', {
		    url: "/accountsetup",
		    templateUrl: "views/signup/accountsetup.html"
	    })
	    .state('signup.plans', {
		    url: "/plans",
		    templateUrl: "views/signup/planpayment.html"
	    })
	    .state('account', {
		    url: "/account",
		    templateUrl: "views/account/account.html",
		    controller: "AccountController"
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

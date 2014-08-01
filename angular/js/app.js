var loginApp = angular.module('loginApp', ['ui.router'])
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
	    .state('account.snapshot', {
		    url: "/snapshot",
		    templateUrl: "views/account/accountsnapshot.html",
	    });
    });

loginApp.service('LoginService', function() {
	return {
		isLoggedIn: false,
		user: false
	}
});

loginApp.directive('transitions', function() {
	return {
		restrict: 'ACE',
		controller: 'TransitionsController'
	}
});

loginApp.directive('loginNavbar', function() {
	return {
		restrict: 'ACE',
		templateUrl: 'views/login-navbar.html',
		controller: 'NavbarController'
	}
});

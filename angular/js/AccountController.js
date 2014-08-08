loginApp.controller('AccountController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	LoginService.confirmLoggedIn($state);

	$scope.user = LoginService.user.local;

	$scope.logOut = function() {
		LoginService.logOut();
		$state.go('login');
	}

	console.log($scope.user);
});

loginApp.controller('AccountController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	LoginService.confirmLoggedIn($state);

	$scope.user = false;

	LoginService.getUser(function(data) {
		if (!data.error) {
			$scope.user = data.user.local;
		}
		else {
			$scope.logOut();
		}
	});

	$scope.logOut = function() {
		LoginService.logOut($state);
	}

});

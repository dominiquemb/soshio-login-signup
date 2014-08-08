loginApp.controller('LoginController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	$scope.loggedIn = LoginService.confirmLoggedIn($state);

	if ($scope.loggedIn) {
		$state.go('account.snapshot');
	}

	$scope.loginForm = {};

	$scope.processLogin = function() {
		$http({
			method: 'POST', 
			params: $scope.loginForm,
			url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/login'
		}).
		success(function(data, status, headers, config) {
			LoginService.login(data.user._id, ($scope.loginForm.rememberMe || false), data.user);
			$state.go('account.snapshot');
		}).
		error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
		});	
	}
});

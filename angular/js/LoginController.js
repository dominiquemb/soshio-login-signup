loginApp.controller('LoginController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	$scope.loggedIn = LoginService.confirmLoggedIn($state);

	if ($scope.loggedIn) {
		$state.go('account.snapshot');
	}

	$scope.loginForm = {};

	$scope.processLogin = function() {
		var params = jQuery.extend(true, {}, $scope.loginForm);
		params.password = CryptoJS.SHA3($scope.loginForm.password);
		$http({
			method: 'POST', 
			params: params,
			url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/login'
		}).
		success(function(data, status, headers, config) {
			LoginService.login(data.user._id, ($scope.loginForm.rememberMe || false));
			$state.go('account.snapshot');
		}).
		error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
		});	
	}
});

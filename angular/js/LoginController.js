loginApp.controller('LoginController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	$scope.loginForm = {};

	$scope.processLogin = function() {
		$http({
			method: 'POST', 
			params: $scope.loginForm,
			url: 'http://localhost:8080/login'
		}).
		success(function(data, status, headers, config) {
			LoginService.user = data.user;
			$state.go('account.snapshot');
		}).
		error(function(data, status, headers, config) {
			console.log('error');
			console.log(data);
		});	
	}
});

loginApp.controller('AccountController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	$scope.user = LoginService.user.local;

	console.log($scope.user);
});

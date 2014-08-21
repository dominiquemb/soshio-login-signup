loginApp.controller('SignupController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	LoginService.logOut($state, true);

	$scope.signup = {};

	$scope.cardInfo = {};

	$scope.numUsers = 0;

	$scope.processSignup = function() {
		if ($scope.signup.password === $scope.signup.confirmPassword) {
			LoginService.newUser($scope.signup, function(data) {
				LoginService.user = data.user
				LoginService.login(data.user._id, false, data.user);
				$state.go('account.snapshot');
			});
		}
	}
});

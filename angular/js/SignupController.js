loginApp.controller('SignupController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	LoginService.logOut($state, true);

	$scope.publicStripeApiKey = 'pk_live_4W3zYxQwD3Q5STZt6DGua5k5';
	$scope.publicStripeApiKeyTesting = 'pk_test_4W3zFdcyJC9Lhc6i5OpFgyhq';

	$scope.signup = {};

	$scope.cardInfo = {};

	$scope.numUsers = 0;

	$scope.selectPlan = function(plan, planFee) {
		$scope.signup.plan = plan;
		$scope.signup.planFee = planFee;
	}

	$scope.selectCard = function(card) {
		$scope.cardInfo.cardType = card;
	}

	$scope.isCard = function(card) {
		return $scope.cardInfo.cardType === card;
	}

	$scope.isPlan = function(plan) {
		return $scope.signup.plan === plan;
	}

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

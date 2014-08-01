loginApp.controller('SignupController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	$scope.signup = {
		users: []
	};

	$scope.numUsers = 0;

	$scope.selectPlan = function(plan) {
		$scope.signup.plan = plan;
	}

	$scope.selectCard = function(card) {
		$scope.signup.cardType = card;
	}

	$scope.isCard = function(card) {
		return $scope.signup.cardType === card;
	}

	$scope.isPlan = function(plan) {
		return $scope.signup.plan === plan;
	}

	$scope.processSignup = function() {
		$http({
			method: 'POST', 
			params: $scope.signup,
			url: 'http://localhost:8080/signup'
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

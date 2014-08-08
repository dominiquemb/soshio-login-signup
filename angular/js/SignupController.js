loginApp.controller('SignupController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	LoginService.logOut();

	$scope.publicStripeApiKey = 'pk_live_4W3zYxQwD3Q5STZt6DGua5k5';
	$scope.publicStripeApiKeyTesting = 'pk_test_4W3zFdcyJC9Lhc6i5OpFgyhq';

	$scope.signup = {
		users: []
	};

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
		var amtArray = $scope.signup.planFee.split('.'),
		centAmt = Math.round(parseInt(amtArray[0]*100)) + parseInt(amtArray[1]);

		Stripe.setPublishableKey($scope.publicStripeApiKeyTesting);

		Stripe.card.createToken({
			number: $scope.cardInfo.cardNumber,
			cvc: $scope.cardInfo.cardSecNumber,
			exp_month: parseInt($scope.cardInfo.cardExpiryMonth),
			exp_year: $scope.cardInfo.cardExpiryYear,
		}, centAmt);

		$http({
			method: 'POST',
			params: {
				token: $scope.signup.token,
				centAmt: centAmt,
				email: $scope.signup.email
			},
			url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/payment'
		}).
		success(function(data) {
			if (data.error) {
				// replace this with something else later
				console.log(data.error);
			}
			else {
				$http({
					method: 'POST', 
					params: $scope.signup,
					url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/signup'
				}).
				success(function(data, status, headers, config) {
					LoginService.user = data.user;
					$state.go('account.snapshot');
				});
			}
		});
	}
});

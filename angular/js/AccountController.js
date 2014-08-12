loginApp.controller('AccountController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	LoginService.confirmLoggedIn($state);

	$scope.user = false;
	$scope.editedUser = false;

	LoginService.getUser(function(data) {
		if (!data.error) {
			$scope.user = data.user.local;
			$scope.user.id = data.user._id;
			$scope.editedUser = $scope.user;
		}
		else {
			$scope.logOut();
		}
	});

	$scope.cancelEditUser = function() {
		$scope.editedUser = $scope.user;
		$state.go('account.userinformation');
	};
	
	$scope.editUserProfile = function() {
		if ($scope.editedUser.newPassword === $scope.editedUser.confirmPassword) {
			var params = JSON.extend(true, {}, $scope.editedUser);
			params.password = CryptoJS.SHA3($scope.editedUser.newPassword);
			$http({
				method: 'POST',
				params: params,
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/update'
			}).
			success(function(data, status, headers, config) {
				$scope.user = $scope.editedUser;
				$state.go('account.userinformation');
			});
		}
	};

	$scope.logOut = function() {
		LoginService.logOut($state);
	}

});

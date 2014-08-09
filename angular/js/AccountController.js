loginApp.controller('AccountController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	LoginService.confirmLoggedIn($state);

	$scope.user = false;

	LoginService.getUser(function(data) {
		if (!data.error) {
			$scope.user = data.user.local;
			$scope.user.id = data.user._id;
		}
		else {
			$scope.logOut();
		}
	});
	
	$scope.editUserProfile = function() {
			$http({
				method: 'POST',
				params: $scope.user,
				url: location.protocol + '//' + location.hostname + ((location.port.length) ? ':' + location.port : "") + '/update'
			}).
			success(function(data, status, headers, config) {
				console.log(data);
			});
	};

	$scope.logOut = function() {
		LoginService.logOut($state);
	}

});

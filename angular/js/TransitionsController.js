loginApp.controller('TransitionsController', function($scope, $rootScope, $timeout, $state) {
	$scope.to = function(target) {
		$scope.exitingTrue = true;
		$timeout(function() {
			$state.go(target);
		}, 200);
	};

	$scope.$on('$locationChangeSuccess', function() {
		$timeout(function() {
			$scope.exitingTrue = false;
		}, 5);
	});
});

loginApp.controller('AccountController', function($scope, $rootScope, $timeout, $state, $http, LoginService) {
	LoginService.confirmLoggedIn($state);

	$scope.user = false;
	$scope.editedUser = {};
	$scope.newAccount = {};
	$scope.newUser = {};
	$scope.currentAccountUsers = [];
	$scope.editedAccount = {};

	$scope.currentAccount = false;

	LoginService.getUser(function(data) {
		if (!data.error) {
			var newPermissions = [];

			$scope.user = data.user.local;

			angular.forEach(data.user.local.permissions, function(entry) {
				newPermissions.push(JSON.parse(entry));
			});

			$scope.user.permissions = newPermissions;

			if ($scope.user.permissions[0]) {
				LoginService.getAccountById($scope.user.permissions[0].id, function(acct) {
					$scope.currentAccount = acct.account;
					$scope.processAccountUsers($scope.currentAccount.permissions);
				});
			}

			$scope.user.id = data.user._id;
			$scope.editedUser = $scope.user;
		}
		else {
			$scope.logOut($state);
		}
	});

	$scope.selectPlan = function(plan, planFee) {
		$scope.editedAccount.plan = plan;
		$scope.editedAccount.planFee = planFee;
	}

	$scope.selectCard = function(card) {
		$scope.editedAccount.cardType = card;
	}

	$scope.isCard = function(card) {
		return $scope.editedAccount.cardType === card;
	}

	$scope.isPlan = function(plan) {
		return $scope.editedAccount.plan === plan;
	}

	$scope.switchAccount = function(acct) {
		$scope.currentAccount = acct;
	};

	$scope.cancelEditUser = function() {
		$scope.editedUser = $scope.user;
		$state.go('account.userinformation');
	};

	$scope.updatePayment = function() {
		LoginService.updateBilling($scope.editedAccount, function(data) {
			console.log(data);
		});
	}
	
	$scope.editUserProfile = function() {
		if ($scope.editedUser.newPassword === $scope.editedUser.confirmPassword) {
			var params = JSON.extend(true, {}, $scope.editedUser);
			params.password = CryptoJS.SHA3($scope.editedUser.newPassword);
			LoginService.update(params, function(data) {
				$scope.user = $scope.editedUser;
				$state.go('account.userinformation');
			});
		}
	};

	$scope.addAdmin = function() {
		if ($scope.currentAccount !== false) {
			$scope.newUser.permissions = [];
			$scope.newUser.permissions.push({
				id: $scope.currentAccount.id,
				perms: $scope.currentAccount.perms,
				name: $scope.currentAccount.name
			});
			$scope.newUser.password = CryptoJS.SHA3(randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
			LoginService.newUser($scope.newUser, function(data) {
				LoginService.addAccountUser({
					account: $scope.currentAccount, 
					user: data.user
				}, function(data) {
					$scope.processAccountUsers(data.account.permissions);
				});
			});

		}
	};

	$scope.processAccountUsers = function(entries) {
		$scope.currentAccountUsers = [];
		angular.forEach(entries, function(acct) {
			$scope.currentAccountUsers.push(JSON.parse(acct));
		});
	};

	$scope.accountSetup = function() {
		LoginService.newAccount($scope.newAccount, function(data) {
			$scope.currentAccount = data.account;
			
			if (!($scope.user.permissions instanceof Array)) {
				$scope.user.permissions = [];
			} 

			$scope.user.permissions.push({
				id: data.account._id,
				perms: 'Read-Write',
				name: data.account.accountName
			});

			LoginService.update($scope.user, function(data) {
				console.log('user updated');
				console.log(data);
			});
		});
	};

	$scope.logOut = function() {
		LoginService.logOut($state);
	}

});

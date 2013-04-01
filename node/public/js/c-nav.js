myModule.controller('NavCtrl', ['$scope', '$location', function($scope, $location) {

	$scope.showSearch = function()
	{
		$('.nav-bar .search-input input[type=text]').css("width", "97.54601226%");
		$('.nav-bar .search-input input[type=text]').css("padding", "0 0 0 2.45398773%");
		$('.nav-bar .search-input input[type=text]').focus();

	};

	$scope.hideSearch = function()
	{
		$('.nav-bar .search-input input[type=text]').css("width", "0");
		$('.nav-bar .search-input input[type=text]').css("padding", "0 0 0 0");
	};

    $scope.goToCreateAccountPage = function()
    {
        $location.path('/createAccount');
    };

}]);

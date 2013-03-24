myModule.controller('NavCtrl', ['$scope', function($scope) {

	$scope.showSearch = function()
	{
		$('.nav-bar .search-input input[type=text]').css("width", "159px");
		$('.nav-bar .search-input input[type=text]').css("padding", "0 0 0 4px");
		$('.nav-bar .search-input input[type=text]').focus();

	};

	$scope.hideSearch = function()
	{
		$('.nav-bar .search-input input[type=text]').css("width", "0");
		$('.nav-bar .search-input input[type=text]').css("padding", "0 0 0 0");
	}

}]);
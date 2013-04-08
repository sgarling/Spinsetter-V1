 //Initialize Soundcloud API
SC.initialize(
{
    client_id: "78bfc6a742a617082972ddc5ef20df2a"
});

/*
 * Initialize Angular application and set up the routing service for the
 * ng-view div. The routing service controls what view is displayed depending
 * on the route path.
 */
var myModule = angular.module('ddPlayer', ['ui'], function($routeProvider, $locationProvider)
{
    $routeProvider.when('/',
    {
        templateUrl: '/html/home.html',
        controller: 'HomeCtrl'
    });

    $routeProvider.when('/profile/:username',
    {
        templateUrl: '/html/profile.html',
        controller: 'ProfileCtrl'
    });

    $routeProvider.when('/createAccount',
    {
        templateUrl: '/html/createAccount.html',
        controller: 'CreateAccountCtrl'
    });
  //$routeProvider.otherwise({redirectTo: '/profile/Danny' });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

//init font size changing
myModule.run(function($rootScope, $window)
{
	$rootScope.windowWidth = $window.outerWidth;
	angular.element($window).bind('resize', function() {
		$rootScope.windowWidth = $window.outerWidth;
	 	$rootScope.$apply('windowWidth');
	});
	function centerText(textDiv, containerDiv) {
		var fTextHeight = parseFloat(textDiv.css('height'));
		var fDivHeight = parseFloat(containerDiv.css('padding-bottom'));
		var fTextWidth = parseFloat(textDiv.css('width'));
		var fDivWidth = parseFloat(containerDiv.css('width'));
		var marginTop = (fDivHeight - fTextHeight) / 2.0;
		var marginLeft = (fDivWidth - fTextWidth) / 2.0 - 1;
		textDiv.css('top', marginTop);
		textDiv.css('left', marginLeft);	
	}	
	//watch window resize to resize fonts for fluid layout
	$rootScope.$watch('windowWidth', function () {
		centerText($('.following-btn-txt'), $('.following-btn'));
		centerText($('.blogs-btn-txt'), $('.blogs-btn'));
		centerText($('.genres-btn-txt'), $('.blogs-btn'));
		centerText($('.popular-btn-txt'), $('.blogs-btn'));
        var navBarHeight = $('.nav-bar').css('padding-bottom');
        console.log(navBarHeight + "woo!");
        $('.nav-bar').css('width', '100%');
        $('.dropdown-ctrls').css('top', parseInt(navBarHeight));
	});
});

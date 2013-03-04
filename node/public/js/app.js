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

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

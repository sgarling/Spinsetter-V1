/*
 * Controller wrapper for the ng-view div. Not totally sure why is necessary at this point,
 * but Angular ng-view example uses a controller basically identical to this
 * (see script.js file at http://docs.angularjs.org/api/ng.directive:ngView)
 */
myModule.controller('PageViewCtrl', ['$scope', '$route', '$routeParams', '$location', 'profileInfo', function($scope, $route, $routeParams, $location, profileInfo)
{
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.profiles = profileInfo.getProfiles();
}]);

/*
 * Controller for individual profile pages. Contains all information necessary to
 * correctly display and update a profile page.
 */
myModule.controller('ProfileCtrl', ['$scope', '$routeParams', 'profileInfo', 'playerService', 'loggedUserService', function($scope, $routeParams, profileInfo, playerService, loggedUserService)
{

  $scope.profile = profileInfo.getProfile($routeParams.username);

  $scope.template = { name: 'profileStream', url: '/html/profileStream.html' };

  $scope.like = function(track)
  {
    var curUser = loggedUserService.getUsername();
    profileInfo.likeTrack(curUser, track);
  };

  //adds track to logged in user's profile
  $scope.reSpin = function(track)
  {
    var curUser = loggedUserService.getUsername();
    profileInfo.addTrack(curUser, track.id);
  };

  $scope.viewLikes = function() { $scope.template = { name: 'profileLikes', url: '/html/profileLikes.html' }; };
  $scope.viewSpinsets = function() { $scope.template = { name: 'profileSpinsets', url: '/html/profileSpinsets.html' }; };
  $scope.viewStream = function() { $scope.template = { name: 'profileStream', url: '/html/profileStream.html' }; };

  $scope.printTrackList = function()
  {
    console.log($scope.profile.streamTracks);
  };


}]);

myModule.controller('HomeCtrl', ['$scope', '$routeParams', 'profileInfo', 'playerService', function($scope, $routeParams, profileInfo, playerService)
{
  $scope.name = "HomeCtrl";
  $scope.list = [1, 2, 3, 4, 6, 7, 8, 9, 20];
}]);

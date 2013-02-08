myModule.controller('PageViewCtrl', ['$scope', '$route', '$routeParams', '$location', 'profileInfo', function($scope, $route, $routeParams, $location, profileInfo) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.profiles = profileInfo.getProfiles();
}]);
 
myModule.controller('ProfileCtrl', ['$scope', '$routeParams', 'profileInfo', 'playerService', function($scope, $routeParams, profileInfo, playerService) {

  $scope.profile = profileInfo.getProfile($routeParams.username);
  $scope.tracks = profileInfo.getTracks($scope.profile);

  $scope.$root.$emit('profileChange', $scope.tracks);

  $scope.playFromCard = function(track) {
    var trackIndex = _.indexOf($scope.profile.trackURLs, "/tracks/" + track.id);
    playerService.playPauseTrack(track, trackIndex);
  }
}]);

myModule.controller('HomeCtrl', ['$scope', '$routeParams', 'profileInfo', 'playerService', function($scope, $routeParams, profileInfo, playerService) {
  $scope.name = "HomeCtrl";
  $scope.list = ["one", "two", "three", "four", "five", "six"];
}]);
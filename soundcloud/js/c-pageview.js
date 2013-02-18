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
myModule.controller('ProfileCtrl', ['$scope', '$routeParams', 'profileInfo', 'playerService', function($scope, $routeParams, profileInfo, playerService) 
{

  $scope.$emit('profileChange');

  $scope.profile = profileInfo.getProfile($routeParams.username);
  $scope.tracks = [];
  
  profileInfo.getTracks($scope.profile);

  /*
   * These observe functions are triggered when the $scope.tracks array is changed
   * (both when originally created and when updated by a drag-and-drop)
   */
  _.observe($scope.tracks, 'create', function(track, index) 
  {
    $scope.$emit('trackCreated', track, index);
  });

  _.observe($scope.tracks, 'delete', function(track, index) 
  {
    $scope.$emit('trackRemoved', track, index);
  });

  
  $scope.playFromCard = function(track) 
  {
    var trackIndex = _.indexOf($scope.profile.trackIDs, track.id);
    var oldTrack = playerService.getCurrentTrack();
    if (track !== oldTrack && oldTrack !== null) { oldTrack.playIconState = "play"; }
    if (track.playIconState === "play") { track.playIconState = "pause"; }
    else { track.playIconState = "play"; }
    playerService.playPauseTrack(track, trackIndex);
  };

  $scope.deleteCard = function(track) 
  {
    var trackIndex = _.indexOf($scope.profile.trackIDs, track.id);
    console.log("track at index " + trackIndex + "deleted");
    $scope.profile.trackIDs.splice(trackIndex, 1);
    $scope.tracks.splice(trackIndex, 1);
  };

  //Event Logic
  /*
   * Callback for 'trackReturned' event
   * -----------------------------------
   * Pushes a soundcloud track object onto the tracks array so the UI
   * correctly updates when the profile loads
   */
  $scope.$on('trackReturned', function(event, track) 
  {
    $scope.tracks.push(track);
  });

  /*
   * Sets the options for the ui:sortable (the list of song cards) so that the
   * dragged by the .card-handle div.
   */
  $scope.sortableOptions = { handle: '.card-handle' };

}]);

myModule.controller('HomeCtrl', ['$scope', '$routeParams', 'profileInfo', 'playerService', function($scope, $routeParams, profileInfo, playerService) 
{
  $scope.name = "HomeCtrl";
}]);
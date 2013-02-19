/* I think if we create the 'sounds' or 'tracklist' object containing all the data before its loaded into the player, it will prevent this
 * soundcloud/angular disagreement, and the whole page would run a lot more smoothly
 */

myModule.controller('PlayerCtrl', ['$scope', 'profileInfo', 'playerService', function($scope, profileInfo, playerService) 
{

  //Initialize $scope.currentTrack so the player has a default image when the page loads
  $scope.currentTrack = { artwork_url: '../img/default-player-artwork.png' };

  /* 
   * ng-click Player Control functions
   *-----------------------------------
   * These functions are wrapper functions that call their corresponding
   * function in the playerService service. They allow for the player to control
   * music flow.
   */
  $scope.play = function() 
  {
    playerService.playFromPlayer();
  };

  $scope.pause = function() 
  {
    playerService.pause();
  };

  $scope.ffwd = function() 
  {
    playerService.ffwd();
  };

  $scope.rewind = function() 
  {
    playerService.rewind();
  };

  $scope.skipFwd = function() 
  {
    playerService.skipFwd();
  };

  $scope.skipBack = function() 
  {
    playerService.skipBack();
  };


  //Event logic

  /*
   * Callback for the 'newTrackPlayed' event
   * ------------------------------------------
   * Updates $scope.currentTrack so that the UI updates correctly on a song change.
   */
  $scope.$on('newTrackPlayed', function(event, track, sound) 
  {
    console.log("new track played!");
    $scope.currentTrack = track;
  });

  /*
   * Callback for the 'trackFinished' event
   * ---------------------------------------
   * Skips to the next track in the playlist. Could potentially be removed if we could
   * call 'skipFwd()' directly in the playerService.
   */
  $scope.$on('trackFinished', function() 
  {
    console.log("track finished!");
    playerService.skipFwd();
  });
}]);  
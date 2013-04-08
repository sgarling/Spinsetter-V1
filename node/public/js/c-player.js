/* I think if we create the 'sounds' or 'tracklist' object containing all the data before its loaded into the player, it will prevent this
 * soundcloud/angular disagreement, and the whole page would run a lot more smoothly
 */

myModule.controller('PlayerCtrl', ['$scope', 'profileInfo', 'playerService', 'loggedUserService', function($scope, profileInfo, playerService, loggedUserService)
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

    $scope.like = function() {
        if ($scope.currentTrack.title !== null) {
            profileInfo.likeTrack(loggedUserService.getUsername(), $scope.currentTrack);
        }
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
    
  var keys = {};
  //Key Bindings
  $(document).keydown(function(e)
  {
    keys[e.keyCode] = true;
    console.log(e.keyCode);
   /* if (e.keyCode == 32) //Spacebar
    {
      e.preventDefault();
      $scope.play();
    } else if (e.keyCode == 39 && !keys[91]) { //Right Arrow Key w/o cmd key
      $scope.ffwd();
    } else if (e.keyCode == 37 && !keys[91]) { //Left Arrow Key w/o cmd key
      $scope.rewind();
    } */
  });

  $(document).keyup(function (e)
  {
    delete keys[e.keyCode];
    
  });

}]);

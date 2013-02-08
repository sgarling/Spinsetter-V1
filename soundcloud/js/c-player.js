/* I think if we create the 'sounds' or 'tracklist' object containing all the data before its loaded into the player, it will prevent this
 * soundcloud/angular disagreement, and the whole page would run a lot more smoothly
 */

myModule.controller('PlayerCtrl', ['$scope', 'profileInfo', 'playerService', function($scope, profileInfo, playerService) {

  var autoPlay = false;
  var playingIndex = 0;
  var playing = false;

  //Controller Variables
  $scope.trackURLs = profileInfo.getProfiles()[0].trackURLs;
  //could add is prev song for audio "memory"

  //ng-click Player Control functions
   $scope.play = function() {
    playerService.playFromPlayer();
  }

  $scope.pause = function() {
    playerService.pause();
  };

  $scope.ffwd = function() {
    playerService.ffwd();
  }

  $scope.rewind = function() {
    playerService.rewind();
  }

  $scope.skipFwd = function() {
    playerService.skipFwd();
  }

  $scope.skipBack = function() {
    playerService.skipBack();
  }

  //Event logic
  $scope.$on('newTrackPlayed', function(event, track, sound) {
    console.log("new track played!");
    $scope.currentTrack = track;
  });

  $scope.$on('trackFinished', function() {
    console.log("track finished!");
    playerService.skipFwd();
  });

  //Startup logic
  if (autoPlay) {
    $scope.play();
    }
}]);  
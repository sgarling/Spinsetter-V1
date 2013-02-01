/* I think if we create the 'sounds' or 'tracklist' object containing all the data before its loaded into the player, it will prevent this
 * soundcloud/angular disagreement, and the whole page would run a lot more smoothly
 */

function PlayerCtrl($scope) {

  var autoPlay = true;
  var playingIndex = 0;
  var playing = false;

  //Initialize Soundcloud API
  SC.initialize({
    client_id: "78bfc6a742a617082972ddc5ef20df2a",
  });

  //Controller Variables
  $scope.trackURLs =  ["/tracks/74494996", "/tracks/294"];

  $scope.currentSound = null;
  //could add is prev song for audio "memory"

  $scope.currentPos = 0;
  //ng-click Player Control functions
  $scope.play = function() {
    if (!playing) {
      if ($scope.currentSound === null) {
        //SC get in order to get arwork, username, track title, etc, SC.stream in order to actually play in audio file
        SC.get($scope.trackURLs[playingIndex], function(track) {
          SC.stream("/tracks/" + track.id, function(audio) {
            $scope.$apply(function() {
              $scope.currentSound = { username: track.user.username, title: track.title, artworkURL: track.artwork_url, audio: audio };
            });
            audio.play({
              whileplaying: function() {
                $scope.$apply(function() {
                  $scope.currentPos = (audio.position / audio.duration) * 200;  
                });
              }
            });
          });
        }); 
      } else {
        $scope.currentSound.audio.play();
      }
      playing = true;
    }
  };

  $scope.pause = function() {
    if($scope.currentSound.audio) { 
      $scope.currentSound.audio.pause(); 
      playing = false;
    }
  };

  $scope.ffwd = function() {
    if($scope.currentSound.audio) {
      $scope.currentSound.audio.setPosition($scope.currentSound.audio.position + 5000);
    }
  }

  $scope.rewind = function() {
    if($scope.currentSound.audio) {
      $scope.currentSound.audio.setPosition($scope.currentSound.audio.position - 5000);
    }
  }

  $scope.skipFwd = function() {
    $scope.currentSound.audio.stop();
    playing = false;
    playingIndex++;
    if (playingIndex === $scope.trackURLs.length) { playingIndex = 0; }
    console.log(playingIndex);
    $scope.currentSound = null;
    $scope.play();
  }

  $scope.skipBack = function() {
    $scope.currentSound.audio.stop();
    playing = false;
    playingIndex--;
    if (playingIndex === -1) { playingIndex = $scope.trackURLs.length - 1; }
    console.log(playingIndex);
    $scope.currentSound = null;
    $scope.play();
  }

  //Startup logic
  if (autoPlay) {
    $scope.play();
    }

  
  $(document).on('click', '.song-progress-wrapper', function(e) {
    var pos = e.pageX - $(this).offset().left;
    var relPos = $scope.currentSound.audio.duration*pos;
    var newPos = relPos/200;
    $scope.currentSound.audio.setPosition(newPos);
  });


}
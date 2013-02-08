 //Initialize Soundcloud API
SC.initialize({
  client_id: "78bfc6a742a617082972ddc5ef20df2a",
});

var myModule = angular.module('ddPlayer', ['ui'], function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../home.html',
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/profile/:username', {
    templateUrl: '../profile.html',
    controller: 'ProfileCtrl'
  });
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

myModule.service('profileInfo', function($rootScope, $q) {
  //profile /track data grabbed from here
  //if these containedd soundcloud track objects instead of trackURLs the player mechanism could be simplified
  var profiles = [
    {username: "Danny", trackURLs: ["/tracks/74494996", "/tracks/294", "/tracks/75868018", "/tracks/74421378"] },
    {username: "Beezy", trackURLs: ["/tracks/75237140", "/tracks/74913382", "/tracks/74432728"] }];

  return {
    getProfiles: function() {
      return profiles;
    },
    getProfile: function(username) {
      var profile = _.find(profiles, function(profile) {
        return profile.username == username;
      });
      return profile;
    },
    getTracks: function(profile) {
      var promises = _.map(profile.trackURLs, function(trackURL) {
        var deferred = $q.defer();
        SC.get(trackURL, function(track) {
          $rootScope.$apply(function() {
            deferred.resolve(track);
          });
        });
        return deferred.promise;
      });

      return $q.all(promises).then(function(tracks) {
        return tracks;
      });
    }
  };
});



myModule.service('playerService', function($rootScope) {

  //Use this function instead of apply in order to safely update DOM when switching between tracks. See: https://coderwall.com/p/ngisma
  $rootScope.safeApply = function(fn) { 
    var phase = this.$root.$$phase; 
    if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } 
    else { this.$apply(fn); } 
  };



  //Event logic
  $rootScope.$on('profileChange', function(event, tracks){
    trackList = tracks;
  });

  $(document).on('click', '.song-progress-wrapper', function(e) {
    var pos = e.pageX - $(this).offset().left;
    var relPos = currentSound.duration*pos;
    var newPos = relPos/200;
    currentSound.setPosition(newPos);
  });

  //Player Logic
  var autoPlay = false;
  var trackIndex = 0;
  var playing = false;

  var trackList = null;
  var currentTrack = null;
  var currentSound = null;
  var currentPos = 0;

  return {
    //Getters & Setters
    getCurrentTrack: function() {
      return currentTrack;
    },

    getCurrentSound: function() {
      return currentSound;
    },

    setCurrentSound: function(sound) {
      currentSound = sound;
    },

    //Player Control Logic
    playFromPlayer: function() {
      if (currentSound === null) {
        SC.stream("/tracks/" + trackList.$$v[0].id, function(audio) {
          currentSound = audio;
          currentTrack = trackList.$$v[0];
          audio.play({
            onplay: function() {
              $rootScope.safeApply(function() {
                $rootScope.$broadcast('newTrackPlayed', currentTrack, currentSound);
              });
            },
            whileplaying: function() {
              $rootScope.safeApply(function() {
                $rootScope.currentPos = (audio.position / audio.duration) * 200;
                if ($rootScope.currentPos == 200) { $rootScope.$broadcast('trackFinished'); }
              });
              //if (currentPos == 200) { skipFwd(); }
            }
          });
        });
        playing = true;
      } else {
        if (!playing) {
          currentSound.play();
          playing = true;
        }
      }
    },
    //Card Sound Control Logic
    playPauseTrack: function(track, index) {
      if (currentTrack === track) {
        console.log("same track!");
        if (!playing) { 
          currentSound.play();
          playing = true;
        } else { 
          currentSound.pause();
          playing = false;
        }
      } else {
        console.log("different track!");
        if (playing) { 
          currentSound.stop(); 
          playing = false;
        }
        SC.stream("/tracks/" + track.id, function(audio) {
          currentSound = audio;
          currentTrack = track;
          trackIndex = index;
          audio.play({
            onplay: function() {
              $rootScope.safeApply(function() {
                $rootScope.$broadcast('newTrackPlayed', currentTrack, currentSound);
              });
            },
            whileplaying: function() {
              $rootScope.safeApply(function() {
                $rootScope.currentPos = (audio.position / audio.duration) * 200;
                if ($rootScope.currentPos == 200) { $rootScope.$broadcast('trackFinished'); }
              });
            }
           });
        }); 
        playing = true;
      }
    },
    pause: function() {
      if(currentSound) {
        if (playing) { 
          currentSound.pause(); 
          playing = false;
        }
      }
    },
    ffwd: function() {
      if(currentSound) {
        $rootScope.safeApply(function() {
          currentSound.setPosition(currentSound.position + 5000);
        });
     }
    },
    rewind: function() {
      if (currentSound) {
        $rootScope.safeApply(function() {
          currentSound.setPosition(currentSound.position - 5000);
        });
      }
    },
    skipFwd: function() {
      if (currentSound) {
        currentSound.stop();
        playing = false;
        trackIndex++;
        if (trackIndex >= trackList.$$v.length) { trackIndex = 0; }
        var track = trackList.$$v[trackIndex];
        this.playPauseTrack(track, trackIndex);
      }
    },
    skipBack: function() {
      if (currentSound) {
        currentSound.stop();
        playing = false;
        trackIndex--;
        if (trackIndex === -1) { trackIndex = trackList.$$v.length - 1; }
        var track = trackList.$$v[trackIndex];
        this.playPauseTrack(track, trackIndex);
      }
    }
  };
});
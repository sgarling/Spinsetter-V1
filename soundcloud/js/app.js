 //Initialize Soundcloud API
SC.initialize(
{
  client_id: "78bfc6a742a617082972ddc5ef20df2a",
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
    templateUrl: '../home.html',
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/profile/:username', 
  {
    templateUrl: '../profile.html',
    controller: 'ProfileCtrl'
  });
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

/*
 * The profileInfo service contains the profile information that needs
 * to be persistent across multiple controllers.
 */
myModule.factory('profileInfo', function($rootScope) 
{
  //profile / track data grabbed from here
  var profiles = [
    {username: "Danny", trackIDs: [74494996, 294, 75868018, 74421378] },
    {username: "Josh", trackIDs: [75237140, 74913382, 74432728] },
    {username: "Samora", trackIDs:[74494996, 294, 75868018, 74421378, 75237140, 74913382, 74432728]}];

  //replaces 100x100px soundcloud artwork url with the 500x500px artwork url
  function getEnlargedArtwork(artwork_url) 
  {
    return artwork_url.replace("large", "t500x500");
  }

  return {
    getProfiles: function() 
    {
      return profiles;
    },
    getProfile: function(username) 
    {
      var profile = _.find(profiles, function(profile) 
      {
        return profile.username == username;
      });
      return profile;
    },
    //Returns an array of Soundcloud 'track' objects that correspond to the track urls in the 'profiles' object
    getTracks: function(profile) 
    {
      _.each(profile.trackIDs, function(trackID) 
      {
        SC.get("/tracks/" + trackID, function(track) 
        {
          track.playIconState = "play";
          $rootScope.$apply(function() 
          {
           //track.artwork_url = getEnlargedArtwork(track.artwork_url); (grabs enlarged artwork URL)
            $rootScope.$broadcast('trackReturned', track);
          });
        });
      });
    }
  };
});



myModule.factory('playerService', function($rootScope) 
{

  //Use this function instead of apply in order to safely update DOM when switching between tracks. See: https://coderwall.com/p/ngisma
  $rootScope.safeApply = function(fn) 
  { 
    var phase = this.$root.$$phase; 
    if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } 
    else { this.$apply(fn); } 
  };

  //Event logic
  /* 
   * Callback for 'profileChange' event
   * -----------------------------------
   * Resets the track list so the correct tracks are displayed on each profile.
   * Also sets the trackIndex to -1 so if the user clicks skipFwd on the player
   * after switching to a new profile that it skips to the first track in the new profile,
   * or if the user clicks skipBack it skips to the last track in the new profile.
   */
  $rootScope.$on('profileChange', function() 
  {
    trackList = [];
    trackIndex = -1;
  });

  /* 
   * The events 'trackCreated' and 'trackDeleted' are trigger when the player cards are dragged and
   * dropped. This updates the player so that the player will play the tracks in the new order.
   */
  $rootScope.$on('trackCreated', function(event, track, index) 
  {
    trackList.splice(index, 0, track);
    if (track === currentTrack) 
    {
      trackIndex = index;
      console.log("playing track now at index " + trackIndex);
    } else {
      trackIndex = _.indexOf(trackList, currentTrack);
      console.log("playing track now at index " + trackIndex);
    }
  });

  $rootScope.$on('trackRemoved', function(event, track, index) 
  {
    trackList.splice(index, 1);
    console.log("track removed");
  });

  /*
   * This click listener allows the user to click on the song progress bar to
   * change the position in the currently playing track.
   */
  $(document).on('click', '.song-progress-wrapper', function(e) 
  {
    var pos = e.pageX - $(this).offset().left;
    var relPos = currentSound.duration*pos;
    var newPos = relPos/200;
    currentSound.setPosition(newPos);
  });


  //init variables for the playerService
  $rootScope.currentPos = 0;

  var autoPlay = false;
  var trackIndex = 0;
  var playing = false;

  var trackList = [];
  var currentTrack = null;
  var currentSound = null;
  var currentPos = 0;

  return {
    //Getters
    getCurrentTrack: function() 
    {
      return currentTrack;
    },

    //Player Control Logic || playFromPlayer could be made cleaner. call playPauseTrack(trackList[0], 0)
    playFromPlayer: function() 
    {
      if (currentSound === null) 
      {
        SC.stream("/tracks/" + trackList[0].id, function(audio) 
        {
          currentSound = audio;
          currentTrack = trackList[0];
          currentTrack.playIconState = "pause";
          trackIndex = 0;
          audio.play(
          {
            onplay: function() 
            {
              $rootScope.safeApply(function() {
                $rootScope.$broadcast('newTrackPlayed', currentTrack, currentSound);
              });
            },
            whileplaying: function() 
            {
              $rootScope.safeApply(function() {
                $rootScope.currentPos = (audio.position / audio.duration) * 200;
                if ($rootScope.currentPos == 200) { $rootScope.$broadcast('trackFinished'); }
              });
            }
          });
        });
        playing = true;
      } else {
        if (!playing) 
        {
          currentSound.play();
          playing = true;
        }
      }
    },
    /*
     * Given a Soundcloud track object and the array index of that track,
     * makes a call to the soundcloud API to stream the track (if a new track)
     * or will just restart the track (if the same track that is already playing)
     */
    playPauseTrack: function(track, index) 
    {
      if (currentTrack === track) 
      {
        console.log("same track!");
        if (!playing) 
        { 
          currentSound.play();
          playing = true;
        } else { 
          currentSound.pause();
          playing = false;
        }
      } else {
        console.log("different track!");
        if (playing) 
        { 
          currentSound.stop(); 
          playing = false;
        }
        SC.stream("/tracks/" + track.id, function(audio) 
        {
          currentSound = audio;
          currentTrack = track;
          trackIndex = index;
          audio.play(
          {
            onplay: function() 
            {
              $rootScope.safeApply(function() 
              {
                $rootScope.$broadcast('newTrackPlayed', currentTrack, currentSound);
              });
            },
            //Updates the progress bar div as the song plays
            whileplaying: function() 
            {
              $rootScope.safeApply(function() 
              {
                $rootScope.currentPos = (audio.position / audio.duration) * 200;
                if ($rootScope.currentPos == 200) { $rootScope.$broadcast('trackFinished'); }
              });
            }
           });
        }); 
        playing = true;
      }
    },
    pause: function() 
    {
      if(currentSound) 
      {
        if (playing) 
        { 
          currentSound.pause(); 
          playing = false;
        }
      }
    },
    ffwd: function() 
    {
      if(currentSound) 
      {
        $rootScope.safeApply(function() 
        {
          currentSound.setPosition(currentSound.position + 5000);
        });
     }
    },
    rewind: function() 
    {
      if (currentSound) 
      {
        $rootScope.safeApply(function() 
        {
          currentSound.setPosition(currentSound.position - 5000);
        });
      }
    },
    skipFwd: function() 
    {
      if (currentSound) 
      {
        currentSound.stop();
        currentTrack.playIconState = "play";
        playing = false;
        trackIndex++;
        if (trackIndex >= trackList.length) { trackIndex = 0; }
        var track = trackList[trackIndex];
        track.playIconState = "pause";
        this.playPauseTrack(track, trackIndex);
      }
    },
    skipBack: function() 
    {
      if (currentSound) 
      {
        currentSound.stop();
        currentTrack.playIconState = "play";
        playing = false;
        trackIndex--;
        if (trackIndex === -1) { trackIndex = trackList.length - 1; }
        var track = trackList[trackIndex];
        track.playIconState = "pause";
        this.playPauseTrack(track, trackIndex);
      }
    }
  };
});
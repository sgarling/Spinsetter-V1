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
/*
 * The profileInfo service contains the profile information that needs
 * to be persistent across multiple controllers.
 */
myModule.factory('profileInfo', function($rootScope)
{

    // static profiles
    var profiles = [
        {username: "Danny", tracksInfo: [74494996, 294, 75868018, 74421378] },
        {username: "Josh", tracksInfo: [75237140, 74913382, 74432728] },
        {username: "Samora", tracksInfo:[74494996, 294, 75868018, 74421378, 75237140, 74913382, 74432728]}];

    var socket = io.connect();
/*    socket.on('tracks', function (data)
    {
        trackIDs = data;
        for(var i = 0; i < trackIDs.length; i++)
            { trackIDs[i] = parseInt(trackIDs[i], 10); }
        console.log('Data updated');
        console.log(data);
        profiles = [
            {username: "Danny", trackIDs: angular.copy(trackIDs)},
            {username: "Josh", trackIDs: angular.copy(trackIDs)},
            {username: "Samora", trackIDs: angular.copy(trackIDs)}];
    }); */
    
    socket.on('tracks', function (data)
    {
        tracksInfo = data;
        console.log('Data updated');
        console.log(data);
        profiles = [
            {username: "Danny", tracksInfo: angular.copy(tracksInfo), likedTracks: [] },
            {username: "Josh", tracksInfo: angular.copy(tracksInfo), likedTracks: [] },
            {username: "Samora", tracksInfo: angular.copy(tracksInfo), likedTracks: [] }];
    });
    
    // replaces 100x100px soundcloud artwork url with the 500x500px artwork url
    function getEnlargedArtwork(artwork_url)
    {
        return artwork_url.replace("large", "t500x500");
    }

    function getProfileIndex(username)
    {
        for (var i = 0; i < profiles.length; i++)
        {
            if (profiles[i].username == username) { return i; }
        }
        return -1;
    }

    return {
        
        //Getters and Setters
        getProfiles: function()
        {
            return profiles;
        },

        getProfile: function(username)
        {
           // var profileIndex = getProfileIndex(username);
            //return profiles[profileIndex];
            var profile = _.find(profiles, function(profile)
            {
                return profile.username == username;
            });
            return profile;
        },

        //Returns an array of Soundcloud 'track' objects that correspond to the track urls in the 'profiles' object
        getTracks: function(profile)
        {
            _.each(profile.tracksInfo, function(trackInfo)
            {
                if (trackInfo.resource == "tracks")
                {
                    SC.get("/tracks/" + trackInfo.id, function(track)
                    {
                        if (track.title != null)
                        {
                            track.playIconState = "play";
                            if (track.artwork_url == null) { track.artwork_url="../img/default-player-artwork.png"; }
                            $rootScope.$apply(function()
                            {
                                //track.artwork_url = getEnlargedArtwork(track.artwork_url); (grabs enlarged artwork URL)
                                $rootScope.$broadcast('trackReturned', track);
                            });
                        } else {
                            $rootScope.$apply(function()
                            {
                                $rootScope.$broadcast('trackInvalid', trackInfo.id);
                            });
                        }
                    });
                } else if (trackInfo.resource == "playlists") {
                    SC.get("/playlists/" + trackInfo.id, function(playlist)
                    {
                        if (playlist.tracks != null)
                        {
                            _.each(playlist.tracks, function(track)
                            {
                                track.playIconState = "play";
                                if (track.artwork_url == null) { track.artwork_url="../img/default-player-artwork.png"; }
                                $rootScope.$apply(function()
                                {
                                    $rootScope.$broadcast('trackReturned', track);
                                });
                            });
                        } else {
                            //trackInvalid event call was here
                        }
                    });
                }
            });
        },
	//Adds respun track to given profile
	//Need to check for duplicate tracks in future implementations
        addTrack: function(username, trackID)
        {
            var index = 0;
            for (var i = 0; i < profiles.length; i++)
            {
                if (profiles[i].username == username) { index = i; }
            }
            profiles[index].trackIDs.push(trackID);
        },

        likeTrack: function(username, track)
        {
            var usernames = _.pluck(profiles, 'username');
            var index = _.indexOf(usernames, username);
            var likedTrackIDs = _.pluck(profiles[index].likedTracks, 'id');
            if (!_.contains(likedTrackIDs, track.id)) { profiles[index].likedTracks.push(track); }
        }
    };
});


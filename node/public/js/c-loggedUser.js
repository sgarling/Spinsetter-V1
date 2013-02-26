
myModule.factory('loggedUserService', function()
{

	var username = "Danny";
	var likedTracks = [];

    return {
        getUsername: function() {
        	return username;
        }
    };
});

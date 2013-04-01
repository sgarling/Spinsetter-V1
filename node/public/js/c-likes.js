myModule.controller('LikesCtrl', ['$scope', 'profileInfo', 'playerService', 'loggedUserService', function($scope, profileInfo, playerService, loggedUserService)
{
	playerService.setTrackList($scope.profile.likedTracks);

	_.observe($scope.profile.likedTracks, 'create', function(track, index)
	{
 		playerService.setTrackList($scope.profile.likedTracks);
 		playerService.updateTrackIndex();
	});

	$scope.playFromCard = function(track)
	{
		var trackIDs = _.pluck(playerService.getTrackList(), 'id');
		var trackIndex = _.indexOf(trackIDs, track.id);
		var oldTrack = playerService.getCurrentTrack();
		if (track !== oldTrack && oldTrack !== null) { oldTrack.playIconState = "play"; }
		if (track.playIconState === "play") { track.playIconState = "pause"; }
		else { track.playIconState = "play"; }
		playerService.playPauseTrack(track, trackIndex);
	};
}]);

myModule.controller('StreamCtrl', ['$scope', 'profileInfo', 'playerService', 'loggedUserService', function($scope, profileInfo, playerService, loggedUserService)
{
	playerService.setTrackList($scope.profile.streamTracks);

	//Controls play/pause from each card
	$scope.playFromCard = function(track)
	{
		var trackIDs = _.pluck($scope.profile.streamTracks, 'id');
		var trackIndex = _.indexOf(trackIDs, track.id);
		var oldTrack = playerService.getCurrentTrack();
		if (track !== oldTrack && oldTrack !== null) { oldTrack.playIconState = "play"; }
		if (track.playIconState === "play") { track.playIconState = "pause"; }
		else { track.playIconState = "play"; }
		playerService.playPauseTrack(track, trackIndex);
	};

	//Remove song from stream until the site is reloaded
	$scope.deleteCard = function(track, playlist)
 	{
		var trackIDs = _.pluck($scope.profile.streamTracks, 'id');
		var trackIndex = _.indexOf(trackIDs, track.id);
		$scope.profile.streamTracks.splice(trackIndex, 1);
 	};

 	//.song-card(s) can only be dragged by the .card-handle div
 	$scope.sortableOptions =
 	{
 		handle: '.card-handle'
 	};

}]);
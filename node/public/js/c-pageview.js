/*
 * Controller wrapper for the ng-view div. Not totally sure why is necessary at this point,
 * but Angular ng-view example uses a controller basically identical to this
 * (see script.js file at http://docs.angularjs.org/api/ng.directive:ngView)
 */
myModule.controller('PageViewCtrl', ['$scope', '$route', '$routeParams', '$location', 'profileInfo', function($scope, $route, $routeParams, $location, profileInfo)
{
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.profiles = profileInfo.getProfiles();
}]);

/*
 * Controller for individual profile pages. Contains all information necessary to
 * correctly display and update a profile page.
 */
myModule.controller('ProfileCtrl', ['$scope', '$routeParams', 'profileInfo', 'loggedUserService', function($scope, $routeParams, profileInfo, loggedUserService)
{
    
    
    $scope.profile = profileInfo.getProfile($routeParams.username);
    
    $scope.template = { name: 'profileStream', url: '/html/profileStream.html' };
    
    $scope.getPlaylists = function()
    {
        return profileInfo.getProfile(loggedUserService.getUsername()).playlists;
    };
    
    $scope.like = function(track)
    {
        var curUser = loggedUserService.getUsername();
        profileInfo.likeTrack(curUser, track);
    };

    $scope.addToPlaylist = function(track, playlistName) {
        profileInfo.addTrackToPlaylist(loggedUserService.getUsername(), track, playlistName, false);
        $scope.$broadcast('trackAddedToPlaylist');
    };

    //adds track to logged in user's profile
    $scope.reSpin = function(track)
    {
        var curUser = loggedUserService.getUsername();
        profileInfo.addTrackToStream(curUser, track);
    };

    $scope.viewLikes = function() { $scope.template = { name: 'profileLikes', url: '/html/profileLikes.html' }; };
    $scope.viewSpinsets = function() { $scope.template = { name: 'profileSpinsets', url: '/html/profileSpinsets.html' }; };
    $scope.viewStream = function() { $scope.template = { name: 'profileStream', url: '/html/profileStream.html' }; };
  
  //sort cards. options are 'title' and 'artist' for now
    $scope.sortBy = function(parameter) {
        $('.isotope').isotope({ sortBy: 'title' });
    };
}]);

myModule.controller('HomeCtrl', ['$scope', '$routeParams', 'profileInfo', function($scope, $routeParams, profileInfo)
{
    $scope.name = "HomeCtrl";
}]);

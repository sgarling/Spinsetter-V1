myModule.directive('ssIsoItemTwo', function($timeout, playerService) {
    
    //extracts top and left position out of a CSS 3dTransform matrix 
    function extractPosition(transformString) {
        var tokens = transformString.split(', ');
        return {
            top: parseInt(tokens[5]),
            left: parseInt(tokens[4])
        };
    }
    
    //sorts array to match DOM (cards sorted left->right top->bottom)
    function sortByPosition(a, b)
    {
        if (Math.abs(a.domPosition.top - b.domPosition.top) < 200)
        {
            return a.domPosition.left - b.domPosition.left;
        }
        return a.domPosition.top - b.domPosition.top;
    }
    
    //link function
    return function($scope, $elem, $attrs) {
        $elem.imagesLoaded(function() {
            $elem.data('track', $scope.track);
            //execute on last ng-repeat item 
            if ($scope.$last) {
                //wait until DOM loaded to configure isotope and extract positions
                $elem.ready(function() {
                    $timeout(function(val) {
                        $elem.parent().imagesLoaded(function() {
                            $elem.parent().isotope({ 
                                itemSelector: '.song-card',
                                getSortData : {
                                    title : function(item) {
                                        return item.find('.song-title').text();
                                    }
                                }
                            }, function() {
                                var trackList = [];
                                $elem.parent().children('.song-card').each(function() {
                                    var track = $(this).data('track');
                                    track.domPosition = extractPosition($(this).css('transform'));
                                    trackList.push(track);
                                });
                                trackList.sort(sortByPosition);
                                _.each(trackList, function(track) {
                                    console.log(track.title)
                                    console.log(track.domPosition);
                                });
                                playerService.setTrackList(trackList);
                            });
                        });
                    }, 0);
                });
            }
        });      
    };
});

myModule.directive('ssIsoItem', function(playerService, $timeout) {
	
	function extractPosition (transformString)
    {
      	var re1='.*?';	// Non-greedy match on filler
    	var re2='\\d+';	// Uninteresting: int
      	var re3='.*?';	// Non-greedy match on filler
      	var re4='\\d+';	// Uninteresting: int
    	var re5='.*?';	// Non-greedy match on filler
  		var re6='\\d+';	// Uninteresting: int
      	var re7='.*?';	// Non-greedy match on filler
      	var re8='\\d+';	// Uninteresting: int
      	var re9='.*?';	// Non-greedy match on filler
      	var re10='\\d+';	// Uninteresting: int
      	var re11='.*?';	// Non-greedy match on filler
      	var re12='\\d+';	// Uninteresting: int
    	var re13='.*?';	// Non-greedy match on filler
        var re14='(\\d+)';	// Integer Number 1
        var re15='.*?';	// Non-greedy match on filler
      	var re16='(\\d+)';	// Integer Number 2
		//Regex to pull top and left values of the div out of the transform matrix
      	var p = new RegExp(re1+re2+re3+re4+re5+re6+re7+re8+re9+re10+re11+re12+re13+re14+re15+re16,["i"]);
      	var m = p.exec(transformString);
		var position = {};
      		if (m != null)
            {
          		var int1=m[1];
        		var int2=m[2];
			position.left = parseInt(int1);
			position.top = parseInt(int2);
      		}
		return position;
	}
	
	function sortByPosition(a, b)
    {
		if (Math.abs(a.domPosition.top - b.domPosition.top) < 200)
        {
			return a.domPosition.left - b.domPosition.left;
		}
		return a.domPosition.top - b.domPosition.top;
	}
		
	return function($scope, $elem, $attrs) {
		$elem.imagesLoaded(function() {
			$elem.addClass('iso-item');
			$elem.data('track', $scope.track);
			$elem.parent().isotope('insert', $elem);
			if ($scope.$last) {
				var $isoContainer = $elem.parent();
				var $isoChildren = $isoContainer.children('.song-card');
				var trackList  = [];
				$isoChildren.each(function() {
					//console.log($(this).css('transform'));
					var track = $(this).data('track');
					track.domPosition = extractPosition($(this).css('transform'));
					trackList.push(track);
					//console.log($(this).find('.song-title').text());
					//console.log($(this).data('track') + ' wootle!');
				});
				trackList.sort(sortByPosition);
				_.each(trackList, function(track) {
					console.log(track.title);
					console.log(track.domPosition);
				});
				playerService.setTrackList(trackList);	
			}
		});
	};
});

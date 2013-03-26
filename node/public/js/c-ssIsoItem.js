myModule.directive('ssIsoItem', function() {
	return function($scope, $elem, $attrs) {
		$elem.imagesLoaded(function() {
			$elem.addClass('iso-item');
			$elem.data('id', $scope.track.id);
			$elem.parent().isotope('insert', $elem);
			if ($scope.$last) {
				var $isoContainer = $elem.parent();
				var $isoChildren = $isoContainer.children('.song-card');
				$isoChildren.each(function() {
					console.log($(this).position());
					console.log($(this).find('.song-title').text());
					console.log($(this).data('id') + ' wootle!');
				});
			}
		});
	};
});

myModule.directive('ssIsoGrid', function() {
	 return function($scope, $elem, $attrs) {
		$elem.isotope( {
			itemSelector : '.iso-item',
			getSortData : {
				title : function(item) {
					return item.find('.song-title').text();
				}	
			}
		});

		$elem.isotope({ sortBy: 'title' });
	};
}); 

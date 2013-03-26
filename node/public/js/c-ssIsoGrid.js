myModule.directive('ssIsoGrid', function() {
	 return function($scope, $elem, $attrs) {
		$elem.isotope( {
			itemSelector : '.iso-item',
			getSortData : {
				title : function(item) {
					console.log(item.find('.song-title').text());
					return item.find('.song-title').text();
				}	
			}
		});

		$elem.isotope({ sortBy: 'title' });
	};
}); 

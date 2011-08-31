(function (Store) {

	Store.init = function () {
		Ajax.GET('/data/sources', function (data) {
			Store.sources = (data) ? JSON.parse(data) : {};
			data_loaded();
		});
	
		Ajax.GET('/data/destinations', function (data) {
			Store.destinations = (data) ? JSON.parse(data) : {};
			data_loaded();
		});
	}
	
	var data_loaded = function () {
		if (Store.sources && Store.destinations) {
			Viz.data_update();
		}
	}
	
	Store.handle_data = function (data) {}	

})(window.Store = {});
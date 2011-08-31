window.addEventListener("DOMContentLoaded", this.init(), false);

function startViz () {
	Viz.init();
	Store.init();
}

function init () {
	var mode = window.location.hash.substr(1);
	
	yepnope({
		test: (mode == 'd3' || mode == ''),
		yep: ['/javascripts/libs/d3/d3.min.js',
					'/javascripts/libs/d3/d3.geom.min.js',
					'/javascripts/libs/d3/d3.layout.min.js',
					'/javascripts/viz/d3.js'],
		complete: function () {
			if (!Viz) {
				alert('No Viz!');
			} else {
				startViz()
			}
		}
	});
}
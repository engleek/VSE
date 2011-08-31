(function (Viz) {
	
	var width = 700,
			height = 700,
			server_address = "192.168.0.124";
	
	var temp_store = window.temp_store = {};
	
	var nodes = window.nodes = [];	
	
	var links = window.links = [];
	
	var root, node, force, recvArc, sentArc;
	
	Viz.init = function () {
		root = d3.select('#viz')
			.append('svg:svg')
				.attr('width', width)
				.attr('height', height);
		
		recvArc = d3.svg.arc()
			.startAngle(0)
			.endAngle(function(d) { return (1 / (1 - d.ups / d.req)) * 2 * Math.PI; })
			.innerRadius(15)
			.outerRadius(20);

		sentArc = d3.svg.arc()
			.startAngle(function(d) { return (1 / (1 - d.ups / d.req)) * 2 * Math.PI; })
			.endAngle(function(d) { return Math.PI * 2; })
			.innerRadius(15)
			.outerRadius(20);
		
		force = d3.layout.force()
			.charge(-300)
			.distance(60)
			.nodes(nodes)
			.links(links)
			.size([width, height]);
			
		force.on('tick', function (e) {
			var nodes = root.selectAll('g.node');
					nodes.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			var link = root.selectAll("line.link")
					.data(links)
		  link.attr("x1", function(d) { return d.source.x; })
			  .attr("y1", function(d) { return d.source.y; })
			  .attr("x2", function(d) { return d.target.x; })
			  .attr("y2", function(d) { return d.target.y; });
		});
	}

	Viz.draw = function () {
		var link = root.selectAll("line.link")
		  .data(links);
		
		link.enter().append("svg:line")
		  .attr("class", "link")
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; })
		  .style('stroke', 'silver');

		node = root.selectAll('g.node').data(nodes);
	
		var nodeEnter = node.enter().append('svg:g')
			.attr('class', 'node')
			.style('fill', 'white')
			.call(force.drag);

		nodeEnter.insert('svg:path')
			.attr('d', recvArc)
			.style('stroke', '#d62728')
			.style('stroke-width', 5);

		nodeEnter.insert('svg:path')
			.attr('d', sentArc)
			.style('stroke', '#2ca02c')
			.style('stroke-width', 5);

		nodeEnter.insert('svg:title')
			.text(function(d) { return d.name; });
				
		force.start();
	}

	Viz.handle_TCP_start = function (data) {}

	Viz.handle_TCP_end = function (data) {}
	
	Viz.data_update = function () {
		if (Store.sources) {
			for (var source in Store.sources) {
				if (!temp_store[source]) {
					temp_store[source] = {
						name: source,
						req: Store.sources[source],
						ups: 50,
						x: width / 2,
						y: height / 2
					}
					
					nodes.push(temp_store[source]);
				}
			}
											
			for (var source in Store.sources) {
				if (source != server_address) {
					links.push({
					  source: temp_store[source],
					  target: temp_store[server_address]
					});
				}
			}
		}
		
		nodes[0].visits = Store.destinations['192.168.0.124'];
		
		Viz.draw();
	}
	
})(window.Viz = {});
var redback = require('redback').createClient();

var Store = function (socket) {

	this.sources = redback.createSortedSet('sources');
	this.destinations = redback.createSortedSet('destinations');

	// Destination data
	this.dst_ports = {};
	this.dst_urls = {};
	this.dst_froms = {};
	
	this.log_TCP_start = function (session) {
		socket.broadcast({
			event: 'tcp.start',
			from: session.src,
			to: session.dst,
			key: session.key
		});
	}

	this.log_TCP_end = function (session) {
		socket.broadcast({
			event: 'tcp.end',
			from: session.src,
			to: session.dst,
			key: session.key
		});
	}
	
	this.log_HTTP_request = function (session, http) {}
	
	this.log_HTTP_response = function (session, http) {
		var source = parse_hostname(session.src);
		var destination = parse_hostname(session.dst);
		
		this.sources.increment(source.host, 1);
		this.destinations.increment(destination.host, http.response.body_len);

		// Add destination port
		if (this.dst_ports[destination.host]) {
			this.dst_ports[destination.port].increment(destination.port, http.response.body_len);
		} else {
			this.dst_ports[destination.port] = redback.createSortedSet('destination_ports:' + destination.host);
			this.dst_ports[destination.port].increment(destination.port, http.response.body_len);
		}

		// Add destination url
		if (this.dst_urls[session.dst]) {
			this.dst_urls[session.dst].increment(http.request.url, http.response.body_len);
		} else {
			this.dst_urls[session.dst] = redback.createSortedSet('destination_urls:' + session.dst);
			this.dst_urls[session.dst].increment(http.request.url, http.response.body_len);
		}
		
		// Add destination from (from whom :)
		if (this.dst_froms[session.dst + http.request.url]) {
			this.dst_froms[session.dst + http.request.url].increment(source.host, http.response.body_len);
		} else {
			this.dst_froms[session.dst + http.request.url] = redback.createSortedSet('destination_froms:' + session.dst + http.request.url);
			this.dst_froms[session.dst + http.request.url].increment(source.host, http.response.body_len);
		}
	}
};

exports.Store = Store;

function parse_hostname (hostname) {
	var parts = hostname.split(":");
	if (/[a-zA-Z]/.test(hostname)) {
		return {host: parts[0].split('.')[0], port: parts[1]};
	} else {
		return {host: parts[0], port: parts[1]};
	}
}
var pcap = require('pcap'),
		http = require('http'),
		url = require('url');

var Pcapper = function (store) {
	// Pcap Session!
	var pcap_session = pcap.createSession('', 'ip proto \\tcp', 10 * 1024 * 1024);

	pcap_session.on('packet', handle_packet);

	// TCP Tracker!
	var tcp_tracker = new pcap.TCP_tracker();

	tcp_tracker.on('start', handle_TCP_start);
	tcp_tracker.on('retransmit', handle_TCP_retransmit);
	tcp_tracker.on('end', handle_TCP_end);
	tcp_tracker.on('reset', handle_TCP_reset);
	tcp_tracker.on('syn retry', handle_TCP_synretry);
	
	tcp_tracker.on('http request', handle_HTTP_request);
	tcp_tracker.on('http request body', handle_HTTP_request_body);
	tcp_tracker.on('http request complete', handle_HTTP_request_complete);
	
	tcp_tracker.on('http response', handle_HTTP_response);
	tcp_tracker.on('http response body', handle_HTTP_response_body);
	tcp_tracker.on('http response complete', handle_HTTP_response_complete);

	tcp_tracker.on('http error', handle_HTTP_error);
	
	// Packet -> Decode -> Tracker!
	function handle_packet (raw_packet) {
		var packet = pcap.decode.packet(raw_packet);
		
		tcp_tracker.track_packet(packet);
	}
	
	// TCP Start!
	function handle_TCP_start (session) {
		store.log_TCP_start(session);
	}

	// TCP Retransmit!
	function handle_TCP_retransmit (session, direction, seqno) {}
	
	// TCP End!
	function handle_TCP_end (session) {
		store.log_TCP_end(session);
	}
	
	// TCP Reset!
	function handle_TCP_reset (session) {}

	// TCP SynRetry!
	function handle_TCP_synretry (session) {}
	
	// HTTP Request!
	function handle_HTTP_request (session, http) {}

	// HTTP Request Body!
	function handle_HTTP_request_body (session, http, data) {}	
	
	// HTTP Request Complete!
	function handle_HTTP_request_complete (session, http) {
		store.log_HTTP_request(session, http);
	}
	
	// HTTP Response!
	function handle_HTTP_response (session, http) {}
	
	// HTTP Response Body!
	function handle_HTTP_response_body (session, http, data) {}
	
	// HTTP Response Complete!
	function handle_HTTP_response_complete (session, http) {
		store.log_HTTP_response(session, http);
	}

	// HTTP Error!
	function handle_HTTP_error (session, direction, error) {}
};

exports.Pcapper = Pcapper;
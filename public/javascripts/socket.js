(function (Socket) {
	var socket = new io.Socket();
	
			socket.on('connect', connection)
			socket.on('disconnect', disconnection)
			socket.on('message', message)
			
			socket.connect('openspace:1337');

	var connection = function () {

	}
	
	var disconnection = function () {

	}
	
	var message = function (message) {
		switch (message.event) {
			case 'tcp.start':
				var date = new Date(message.time);
				console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - ' + message.event + ' - ' + message.src + ' ~~> ' + message.dst);
				
				window.viz.handle_TCP_start(message);
			break;
			
			case 'tcp.end':
				var date = new Date(message.time);
				console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - ' + message.event + ' - ' + message.src + ' ~~> ' + message.dst);
				
				window.viz.handle_TCP_end(message);
			break;
			
			case 'http.request':
				var date = new Date(message.time);
				console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - ' + message.event + ' - ' + message.src + ' ~~> ' + message.dst);
				
				store.handle_data(message)
			break;
			
			case 'http.response':
				var date = new Date(message.time);
				console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - ' + message.event + ' - ' + message.src + ' ~~> ' + message.dst);
				
				store.handle_data(message)
			break;
			
			default:
				console.log('Unknown socket event: ' + data.event);
			break;
		}
	}
})(window.Socket = {});
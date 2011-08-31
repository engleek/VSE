var Server = function (app) {
	var io = require('socket.io').listen(app);
	
	io.sockets.on('connection', handleConnection);
	io.sockets.on('disconnect', handleDisconnect);
	io.sockets.on('message', handleMessage);
	
	function handleConnection () {}

	function handleDisconnect () {}
	
	function handleMessage () {}
	
	this.broadcast = function (event, data) {
		io.sockets.emit(event, data);
	}
}

exports.Server = Server;
require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var Redis = require('redis'),
		Web = require('web'),
		Socket = require('socket'),
		Pcapper = require('pcapper'),
		Store = require('store');

web = new Web.Server(__dirname);
socket = new Socket.Server(web.app);
store = new Store.Store(socket);
pcapper = new Pcapper.Pcapper(store);

// Start the machine!
web.listen(1337);
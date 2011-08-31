var express = require('express'),
//		solder = require('solder'),
		redback = require('redback').createClient();

var Server = function (dir, db) {
	var app = this.app = express.createServer();
	
	var sources = redback.createSortedSet('sources');
	var destinations = redback.createSortedSet('destinations');

	app.configure(function () {
	  app.set('views', dir + '/views');
	  app.set('view engine', 'jade');
	
	  app.use(express.bodyParser());
	  app.use(express.methodOverride());
	
	  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
	  app.use(app.router);
	  app.use(express.static(dir + '/public'));
	});

//	solder.expressRoute(app);
  
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	
	app.get('/', function (req, res) {
	  res.render('index');
	});

	app.get('/data/sources', function (req, res) {
		sources.get(function (err, data) {
			if (err) {
				res.send(err, 500);
			} else {
				res.send(data, {'Content-Type': 'application/json'}, 200);
			}
		});
	});

	app.get('/data/destinations', function (req, res) {
		destinations.get(function (err, data) {
			if (err) {
				res.send(err, 500);
			} else {
				res.send(data, {'Content-Type': 'application/json'}, 200);
			}
		});
	});

	app.get('/data/:host', function (req, res) {
		var temp = redback.createSortedSet('destination_ports:' + req.params.host);
		temp.get(function (err, data) {
			if (err) {
				res.send(err, 500);
			} else {
				res.send(data, {'Content-Type': 'application/json'}, 200);
			}
		});
	});

	app.get('/data/:host/:port', function (req, res) {
		var temp = redback.createSortedSet('destination_urls:' + req.params.host + ':' + req.params.port);
		temp.get(function (err, data) {
			if (err) {
				res.send(err, 500);
			} else {
				res.send(data, {'Content-Type': 'application/json'}, 200);
			}
		});
	});

	app.get('/data/:host/:port/:url([\-\./a-zA-Z0-9]+)', function (req, res) {
		var temp = redback.createSortedSet('destination_froms:' + req.params.host + ':' + req.params.port + req.params.url);
		temp.get(function (err, data) {
			if (err) {
				res.send(err, 500);
			} else {
				res.send(data, {'Content-Type': 'application/json'}, 200);
			}
		});
	});
			
	this.listen = function (port) {
		app.listen(port);
		console.log("\nListening on %d.", app.address().port);
	}
}

exports.Server = Server;
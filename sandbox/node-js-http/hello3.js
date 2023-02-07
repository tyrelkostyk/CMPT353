// tyrel kostyk

const http = require('http');

var routes = {
	'/': function index (request, response) {
		response.writeHead(200);
		response.end('Welcome to /! The keepers of the past...');
	},
	'/foo': function foo (request, response) {
		response.writeHead(200);
		response.end('Welcome to foo... explorers of the unknown...');
	}
}

http.createServer(function (request, response) {

	if (request.url in routes) {
		return routes[request.url](request, response);
	}

	response.writeHead(404);
	response.end(http.STATUS_CODES[404]);

}).listen(1337);

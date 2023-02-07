
const http = require('http');	// loads HTTP module

http.createServer( (request, response) => {
	// 1. tell the browser everything is okay (code 200)
	response.writeHead(200, {
		'Content-Type': 'text/plain'
	});

	// 2. write the announced text to the body of the page
	response.write('Hello FUCKER\n');

	// 3. tell the server that all of the response headers and body have been sent
	response.end();

} ).listen(8080);	// 4. tells the server what port to be on

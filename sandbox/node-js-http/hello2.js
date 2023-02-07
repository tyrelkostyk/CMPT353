// tyrel kostyk

const express = require('express');

const app = express();

const port = 3000;

// routes HTTP GET requests to the path '/' with the provided callback function
app.get('/', function(request, response) {
	response.send('Hello world:)');
});

// make the app listen
app.listen(port, function() {
	console.log('Server listening on http://localhost:' + port);
});

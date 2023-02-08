// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Assignment 2 Part A
// February 8 2023

const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");

const port = 3000;
const host = '0.0.0.0';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/postings', (req, res) => {
  res.sendFile(__dirname + '/postings.html')
});

app.post('/postmessage', (req, res) => {
	// retrieve posted parameters
    const topic = req.body.topic;
    const data = req.body.data;

	// retrieve current date & time
	const date 		= new Date();
	const day 		= date.getDate();
	const month 	= date.getMonth();
	const year 		= date.getFullYear();
	const hour 		= date.getHours();
	const minute 	= date.getMinutes();
	const second 	= date.getSeconds();
	const datetime = (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);

	// combine inputs and datetime
	const final = (datetime + ' || ' + topic + " | " + data + '\n');

	console.log('POST Request Received! Writing to file: ' + final);

	// append input and timestamp to file (will create if doesn't exist)
	fs.appendFile("posts.txt", final, function (err) {
		if (err) return console.error(err);
	});

	var response = new Object();
	response.answer = "wrote successfully!";
	res.send(JSON.stringify(response));
});

// make the app listen
app.listen(port, host);

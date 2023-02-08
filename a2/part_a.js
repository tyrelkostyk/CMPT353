// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Assignment 2 Part A
// February 8 2023

const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

	// append input and timestamp to file (will create if doesn't exist)
	fs.appendFile("posts.txt", final, function (err) {
		if (err) return console.error(err);
	});
});

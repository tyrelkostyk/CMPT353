// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Assignment 3, Parts A B and C
// February 8 2023

const express = require('express');
const bodyParser = require('body-parser');
const mySql = require('mysql');
// TODO: how does this work?
// const database = require('./sqlConnection');

const port = 3306;
const host = '0.0.0.0';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


// TODO: what does this do? Is it necessary?
// module.exports = connection;


let connection = mySql.createConnection({
	user: "tyrel",
	password: ""
});
connection.connect((err) => {
	if (err) {
		console.log("Failed to connect to MySql DB ", err);
	} else {
		console.log("Connected to MySql DB ", err);
	}
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/postings.html')
});


// A3 Part A -> initialize a DB
app.get('/init', (req, res) => {
	// var success = false;
	// console.log("1");
	// var connection = mySql.createConnection({
	// 	host: "127.0.0.1",
	// 	user: "tyrel",
	// 	password: ""
	// });
	// console.log("2");
	// connection.connect((err) => {
	// 	console.log("3");
	// 	if (err) {
	// 		console.log("3a");
	// 		console.log("Failed to connect to MySql DB ", err);
	// 		success = false;
	// 	} else {
	// 		console.log("3b");
	// 		console.log("Connected to MySql DB ", err);
	// 		success = true;
	// 	}
	// });
	// console.log("4");

	// var databaseName = "postdb";
	// var createQuery = `CREATE DATABASE ${databaseName}`;
	// database.query(createQuery, (err) => {
	// 	if (err) { throw err; }
	// 	console.log("MySql DB (" + databaseName + ") created successfully");
	//
	// 	var useQuery = `USE ${databaseName}`;
	// 	database.query(useQuery, (err) => {
	// 		if (err) { throw err; }
	// 		console.log("Using " + databaseName + " database");
	// 	});
	// });
	// TODO: create table named posts
	// TODO: send response

	var response = new Object();
	if (success) response.answer = "Success!";
	else 		 response.answer = "Failed.";
	res.send(JSON.stringify(response));
});


// A3 Part B -> Add a new posted message to DB
app.post('/addPost', (req, res) => {
	// retrieve posted parameters
    const topic = req.body.topic;
    const data = req.body.data;

	// TODO: do I need this?
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

	// TODO: send to DB

	var response = new Object();
	response.answer = "wrote successfully!";
	res.send(JSON.stringify(response));
});


// A3 Part C -> GET method that returns all the posted DB entries
app.get('/getPosts', (req, res) => {
	// TODO:
});

// make the app listen
app.listen(port, host);

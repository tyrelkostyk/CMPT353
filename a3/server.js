// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Assignment 3, Parts A B and C
// February 8 2023

const express = require('express');
const bodyParser = require('body-parser');
const mySql = require('mysql');

const port = 3000;
const host = 'localhost';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var databaseName = "postdb";
var tableName = "posts";

let connection = mySql.createConnection({
	host: 'localhost',
	user: "root",
	password: "password",
	database: "postdb"
});
connection.connect((err) => {
	if (err) throw err;
	console.log("Connected to MySql DB ");
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/postings.html')
});


// A3 Part A -> initialize a DB
app.get('/init', (req, res) => {
	var createQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
	connection.query(createQuery, (err) => {
		if (err) { throw err; }
		console.log("MySql DB (" + databaseName + ") created successfully");

		var useQuery = `USE ${databaseName}`;
		connection.query(useQuery, (err) => {
			if (err) { throw err; }
			console.log("Using " + databaseName + " database");
		});
	});
	// create table named posts
	var createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
		id		INT UNSIGNED NOT NULL auto_increment,
		topic	VARCHAR(100) NOT NULL,
		data	VARCHAR(100) NOT NULL,
		PRIMARY KEY (id)
	)`;
	connection.query(createTableQuery, (err) => {
		if (err) { throw err; }
		console.log("Created " + tableName + " database");
	});

	var response = new Object();
	response.answer = "Success!";
	res.send(JSON.stringify(response));
});


// A3 Part B -> Add a new posted message to DB
app.post('/addPost', (req, res) => {
	console.log(req.body);
    const topic = req.body.topic;
    const data = req.body.data;

	console.log('POST Request Received! Topic: ' + topic + ' Data: ' + data);

	// insert into table
	var insertQuery = `INSERT INTO ${tableName} (topic, data)
		VALUES ('${topic}', '${data}') `;
	connection.query(insertQuery, (err, result) => {
		if (err) throw err;
		console.log("Inserted " + topic + ":" + data);
	})

	var response = new Object();
	response.answer = "wrote successfully!";
	res.send(response);
});


// A3 Part C -> GET method that returns all the posted DB entries
app.get('/getPosts', (req, res) => {
	// TODO:
});

// make the app listen
app.listen(port, host, () => {
	console.log(`Server started on http://${host}:${port}`);
});

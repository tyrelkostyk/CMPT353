// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Assignment 3, Parts A B and C
// March 1 2023

const express = require('express');
const bodyParser = require('body-parser');
const mySql = require('mysql');

const port = 3000;
const host = '0.0.0.0';
// const host = 'localhost';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var databaseName = "postdb";
var tableName = "posts";

let connection = mySql.createConnection({
	// host: "0.0.0.0",
	// host: "localhost",
	host: "mysql1",
	user: "root",
	port: 3306,
	password: "password",
	// database: "postdb"
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/postings.html')
});

// A3 Part A -> initialize a DB
app.get('/init', (req, res) => {

	connection.connect((err) => {
		if (err) throw err;
		console.log("Connected to MySql DB ");
	});

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
	var response = new Object();

	// select from table
	var selectQuery = `SELECT * FROM ${tableName}`;
	connection.query(selectQuery, (err, result) => {
		if (err) throw err;
		response = JSON.parse(JSON.stringify(result));
		console.log("Retrieved: ", response);
		res.json(response);
	})
});

// make the app listen
app.listen(port, host, () => {
	console.log(`Server started on http://${host}:${port}`);
});

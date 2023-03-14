// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Assignment 4
// March 15 2023

const express = require('express');
const bodyParser = require('body-parser');
const mySql = require('mysql');
const path = require('path').join(__dirname, 'frontend', 'build');
const cors = require('cors');

const port = 3000;
// const host = '0.0.0.0';
const host = 'localhost';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path));
app.use(cors());

var databaseName = "postdb";
var tableName = "posts";

let connection = mySql.createConnection({
	// host: "0.0.0.0",
	// host: "localhost",
	// host: "mysql1",
	user: "root",
	// port: 3306,
	password: "password",
	// database: "postdb"
});


// Part A -> initialize a DB and table
app.get('/api/init', (req, res) => {

	connection.connect((err) => {
		if (err) throw err;
		console.log("Connected to MySql DB ");
	});

	// create the database
	var createQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
	connection.query(createQuery, (err) => {
		if (err) { throw err; }
		console.log("MySql DB (" + databaseName + ") created successfully");

		var useQuery = `USE ${databaseName}`;
		connection.query(useQuery, (err) => {
			if (err) { throw err; }
			console.log("Using " + databaseName + " database");

			// drop the table (if it exists)
			var dropQuery = `DROP TABLE IF EXISTS ${tableName}`;
			connection.query(dropQuery, (err) => {
				if (err) { throw err; }
				console.log("Dropped " + tableName + " table");
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
				console.log("Created " + tableName + " table");
			});
		});
	});

	var response = new Object();
	response.answer = "Success!";
	res.send(JSON.stringify(response));
});


// Part B -> Add a new posted message to DB
app.post('/api/addPost', (req, res) => {
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


// Part B -> GET method that returns all the posted DB entries
app.get('/api/getPosts', (req, res) => {
	var response = new Object();

	// select from table
	var selectQuery = `SELECT * FROM ${tableName}`;
	connection.query(selectQuery, (err, result) => {
		if (err) {
			console.log("getPosts failed: ", err);
		} else {
			response = JSON.parse(JSON.stringify(result));
			console.log("Retrieved: ", response);
			res.json(response);
		}
	})

	res.send(response);
});


// Handles any requests that don't match the ones above
app.get('*', (req,res) => {
  res.sendFile('index.html', {path});
});

// make the app listen
app.listen(port, host, () => {
	console.log(`Server started on http://${host}:${port}`);
});

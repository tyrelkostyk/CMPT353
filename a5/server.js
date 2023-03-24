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
const host = '0.0.0.0';
// const host = 'localhost';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path));
app.use(cors());

const databaseName = "postdb";
const tableName = "posts";

const connection = mySql.createConnection({
	// host: "mysql1",
	host: process.env.DB_HOST,
	user: "root",
	// port: 3306,
	password: "password",
	// database: "postdb"
});


// Part A -> initialize a DB and table
let serverInitialized = false;
app.get('/api/init', (req, res) => {

	// prevent multiple connection attempts
	if (serverInitialized) {
		console.log("Server DB already initialized.");
		res.json({ answer: "Success!" });
		return;
	}

	connection.connect((err) => {
		if (err) {
			console.error("Failed to connect to database: ", err);
			res.status(500).send("Error connecting to database.");
		}
		console.log("Connected to MySql DB ");
	});

	// create the database
	const createQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
	connection.query(createQuery, (err) => {
		if (err) {
			console.error("Failed to create database: ", err);
			res.status(500).send("Error creating database.");
		}
		console.log("MySql DB (" + databaseName + ") created successfully");

		const useQuery = `USE ${databaseName}`;
		connection.query(useQuery, (err) => {
			if (err) {
				console.error("Failed to use database: ", err);
				res.status(500).send("Error using database.");
			}
			console.log("Using " + databaseName + " database");

			// drop the table (if it exists)
			const dropQuery = `DROP TABLE IF EXISTS ${tableName}`;
			connection.query(dropQuery, (err) => {
				if (err) {
					console.error("Failed to drop table: ", err);
		            res.status(500).send("Error dropping table.");
				}
				console.log("Dropped " + tableName + " table");
			});

			// create table named posts
			const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
				id		INT UNSIGNED NOT NULL auto_increment,
				topic	VARCHAR(100) NOT NULL,
				data	VARCHAR(100) NOT NULL,
				PRIMARY KEY (id)
			)`;
			connection.query(createTableQuery, (err) => {
				if (err) {
					console.error("Failed to create table: ", err);
		            res.status(500).send("Error creating table.");
				} else {
					console.log("Created " + tableName + " table");
					serverInitialized = true;
					res.json({ answer: "Success!" });
				}
			});
		});
	});
});


// Part B -> Add a new posted message to DB
app.post('/api/addPost', (req, res) => {
    const topic = req.body.topic;
    const data = req.body.data;

	console.log('POST Request Received! Topic: ' + topic + ' Data: ' + data);

	// insert into table
	const insertQuery = `INSERT INTO ${tableName} (topic, data)
						VALUES ('${topic}', '${data}') `;
	connection.query(insertQuery, (err, result) => {
		if (err) {
            console.error("Failed to insert post: ", err);
            res.status(500).send("Error inserting post into the database.");
        } else {
            console.log("Inserted " + topic + ":" + data);
            res.json({ answer: "wrote successfully!" });
        }
	})
});


// Part B -> GET method that returns all the posted DB entries
app.get('/api/getPosts', (req, res) => {
	// select from table
	const selectQuery = `SELECT * FROM ${tableName}`;
	connection.query(selectQuery, (err, result) => {
		if (err) {
			console.log("getPosts failed: ", err);
			res.status(500).send("Error querying the database.");
		} else {
			const response = JSON.parse(JSON.stringify(result));
			console.log("Retrieved: ", response);
			res.json(response);
		}
	});
});


// Handles any requests that don't match the ones above
app.get('*', (req,res) => {
  res.sendFile('index.html', {path});
});

// make the app listen
app.listen(port, host, () => {
	console.log(`Server started on http://${host}:${port}`);
});

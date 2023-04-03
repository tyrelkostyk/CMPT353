// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Project (Database API Node.js Server)
// April 6 2023

/*******************************************************************************
						  	DECLARATIONS & INCLUDES
*******************************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const mySql = require('mysql');
const cors = require('cors');

const port = 3000;
const host = '0.0.0.0';
// const host = 'localhost';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const databaseName = "db";
const channelTableName = "channels";
const messageTableName = "messages";
const replyTableName = "replies";
const accountTableName = "accounts";

// connect to the MySql server
const connection = mySql.createConnection({
	host: process.env.DB_HOST,
	user: "root",
	password: "password",
});

// make an asynchronous query to the MySql database
function asyncQuery(query, params = []) {
	return new Promise((resolve, reject) => {
		connection.query(query, params, (err, result) => {
			if (err) reject(err);
			else     resolve(result);
		});
	});
}

/*******************************************************************************
									SETUP
*******************************************************************************/

// Initialize the DB and tables
let serverInitialized = false;
async function initDb() {

	// prevent multiple connection attempts
	if (serverInitialized) {
		console.log("Server DB already initialized.");
		return;
	}

	// connect to mysql
	connection.connect((err) => {
		if (err) {
			console.error("Failed to connect to mysql: ", err);
			return;
		}
		console.log("Connected to MySql");
	});

	// create the database
	const createQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
	try {
		await asyncQuery(createQuery);
		console.log("MySql DB (" + databaseName + ") created successfully");
	} catch (err) {
		console.error("Failed to create database: ", err);
		return;
	}

	// use the database
	const useQuery = `USE ${databaseName}`;
	try {
		await asyncQuery(useQuery);
		console.log("Using " + databaseName + " database");
	} catch (err) {
		console.error("Failed to use database: ", err);
		return;
	}

	// query to create channel table
	const createAccountTableQuery = `CREATE TABLE IF NOT EXISTS ${accountTableName} (
		Username	VARCHAR(100) NOT NULL,
		Password	VARCHAR(100) NOT NULL,
		DisplayName	VARCHAR(100) NOT NULL,
		PRIMARY KEY (Username)
	)`;

	// query to create channel table
	const createChannelTableQuery = `CREATE TABLE IF NOT EXISTS ${channelTableName} (
		ChannelId			INT UNSIGNED NOT NULL auto_increment,
		ChannelName			VARCHAR(100) NOT NULL,
		ChannelDescription	VARCHAR(100) NOT NULL,
		PRIMARY KEY (ChannelId)
	)`;

	// query to create message table
	const createMessageTableQuery = `CREATE TABLE IF NOT EXISTS ${messageTableName} (
		MessageId	INT UNSIGNED NOT NULL auto_increment,
		ChannelId	VARCHAR(100) NOT NULL,
		MessageText	VARCHAR(100) NOT NULL,
		PRIMARY KEY (MessageId)
	)`;

	// query to create reply table
	const createReplyTableQuery = `CREATE TABLE IF NOT EXISTS ${replyTableName} (
		ReplyId		INT UNSIGNED NOT NULL auto_increment,
		MessageId	VARCHAR(100) NOT NULL,
		ReplyText	VARCHAR(100) NOT NULL,
		PRIMARY KEY (ReplyId)
	)`;

	// create the tables
	try {
		await asyncQuery(createAccountTableQuery);
		console.log("Created user accounts table");

		await asyncQuery(createChannelTableQuery);
		console.log("Created channels table");

		await asyncQuery(createMessageTableQuery);
		console.log("Created messages table");

		await asyncQuery(createReplyTableQuery);
		console.log("Created replies table");

		serverInitialized = true;

	} catch (err) {
		console.error("Failed to create tables: ", err);
		return;
	}
}

initDb();


/*******************************************************************************
									ACCOUNTS
*******************************************************************************/

// ...

/*******************************************************************************
									CHANNELS
*******************************************************************************/

// Create a new channel
app.post('/api/addChannel', async (req, res) => {
	const { name, description } = req.body;

	console.log('POST (create channel) -> Name: ' + name + ' Description: ' + description);

	// insert new channel into channel table
	const insertQuery = `INSERT INTO ${channelTableName} (ChannelName, ChannelDescription)
						VALUES ('${name}', '${description}') `;

	try {
		await asyncQuery(insertQuery);
		console.log("Created channel: " + name + ":" + description);
		res.json({ answer: "Created channel successfully!" });

	} catch (err) {
		console.error("Failed to create channel: ", err);
		res.status(500).send("Error inserting new channel into the database.");
	}
});


// Return list of all channels
app.get('/api/getChannels', async (req, res) => {

	console.log('GET (all channels)');

	// select from table
	const selectQuery = `SELECT * FROM ${channelTableName}`;

	try {
		result = await asyncQuery(selectQuery);
		const response = JSON.parse(JSON.stringify(result));
		console.log("Retrieved Channels: ", response);
		res.json(response);

	} catch (err) {
		console.log("getChannels failed: ", err);
		res.status(500).send("Error querying the database for channel.");
	}
});


/*******************************************************************************
									MESSAGES
*******************************************************************************/

// Add a new message to a channel
app.post('/api/addMessage/:channelId', async (req, res) => {
	const channelId = req.params.channelId;
    const { text } = req.body;

	console.log('POST (add message) -> ChannelId: ' + channelId + ' Text: ' + text);

	// insert new message into message table
	const insertQuery = `INSERT INTO ${messageTableName} (ChannelId, MessageText)
						VALUES ('${channelId}', '${text}') `;

	try {
		await asyncQuery(insertQuery);
		console.log("Added message " + channelId + ":" + text);
		res.json({ answer: "Added message successfully!" });

	} catch (err) {
		console.error("Failed to add message: ", err);
		res.status(500).send("Error adding message into the database.");
	}
});


// Return all messages in a channel
app.get('/api/getMessages/:channelId', async (req, res) => {
	const channelId = req.params.channelId;

	console.log('GET (all messages) -> ChannelId: ' + channelId);

	// select from table
	const selectQuery = `SELECT * FROM ${messageTableName} WHERE ChannelId = ${channelId}`;

	try {
		result = await asyncQuery(selectQuery);
		const response = JSON.parse(JSON.stringify(result));
		console.log("Retrieved Messages: ", response);
		res.json(response);

	} catch (err) {
		console.log("getMessages failed: ", err);
		res.status(500).send("Error querying the database for messages.");
	}
});

/*******************************************************************************
									REPLIES
*******************************************************************************/

// Add a new reply to a message
app.post('/api/addReply/:messageId', async (req, res) => {
	const messageId = req.params.messageId;
    const { text } = req.body;

	console.log('POST (add reply) -> MessageId: ' + messageId + ' Text: ' + text);

	// insert new reply into reply table
	const insertQuery = `INSERT INTO ${replyTableName} (MessageId, ReplyText)
						VALUES ('${messageId}', '${text}') `;

	try {
		await asyncQuery(insertQuery);
		console.log("Added reply " + messageId + ":" + text);
		res.json({ answer: "Added reply successfully!" });

	} catch (err) {
		console.error("Failed to add reply: ", err);
		res.status(500).send("Error adding reply into the database.");
	}
});


// Return all replies to a post
app.get('/api/getReplies/:messageId', async (req, res) => {
	const messageId = req.params.messageId;

	console.log('GET (all replies) -> MessageId: ' + messageId);

	// select from table
	const selectQuery = `SELECT * FROM ${replyTableName} WHERE MessageId = ${messageId}`;

	try {
		result = await asyncQuery(selectQuery);
		const response = JSON.parse(JSON.stringify(result));
		console.log("Retrieved Replies: ", response);
		res.json(response);

	} catch (err) {
		console.log("getReplies failed: ", err);
		res.status(500).send("Error querying the database for replies.");
	}
});


// make the app listen
app.listen(port, host, () => {
	console.log(`Database API Server started on http://${host}:${port}`);
});
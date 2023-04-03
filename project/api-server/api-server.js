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

// Connect to the MySql server
const connection = mySql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

// Make an asynchronous query to the MySql database
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
async function initDb() {

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
		Author		VARCHAR(100) NOT NULL,
		ChannelId	VARCHAR(100) NOT NULL,
		MessageText	VARCHAR(100) NOT NULL,
		Score		INT UNSIGNED NOT NULL,
		PRIMARY KEY (MessageId)
	)`;

	// query to create reply table
	const createReplyTableQuery = `CREATE TABLE IF NOT EXISTS ${replyTableName} (
		ReplyId		INT UNSIGNED NOT NULL auto_increment,
		Author		VARCHAR(100) NOT NULL,
		MessageId	VARCHAR(100) NOT NULL,
		ReplyText	VARCHAR(100) NOT NULL,
		Score		INT UNSIGNED NOT NULL,
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
	// TODO: grab username from request
	const author = "steve";

	console.log('POST (add message) -> ChannelId: ' + channelId + ' Text: ' + text + ' Author: ' + author);

	// insert new message into message table
	const insertQuery = `INSERT INTO ${messageTableName} (Author, ChannelId, MessageText, Score)
						VALUES ('${author}', '${channelId}', '${text}', '${0}') `;

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
	// TODO: grab username from request
	const author = "jeff";

	console.log('POST (add reply) -> MessageId: ' + messageId + ' Text: ' + text + ' Author: ' + author);

	// insert new reply into reply table
	const insertQuery = `INSERT INTO ${replyTableName} (Author, MessageId, ReplyText, Score)
						VALUES ('${author}', '${messageId}', '${text}', '${0}') `;

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


/*******************************************************************************
									VOTING
*******************************************************************************/

app.put('/api/voteMessage/:messageId/:vote', async (req, res) => {
	const { messageId, vote } = req.params;

	// TODO: add checks before implementing votes

	let voteValue = 0;
	if (vote == "up") {
 		voteValue = 1;
	} else if (vote == "down") {
		voteValue = -1;
	} else {
		console.log("voteMessage failed (invalid param): " + vote);
		res.status(500).send("Invalid vote given.");
	}

	console.log('PUT (add vote) -> MessageId: ' + messageId + ' vote: ' + vote);

	// update item in table
	const updateQuery = `UPDATE ${replyTableName} SET Score = Score + ${voteValue} WHERE MessageId = ${messageId}`;

	try {
		await asyncQuery(updateQuery);
		console.log("Voted on message: " + messageId);
		res.json({ answer: "Voted on message successfully!" });

	} catch (err) {
		console.log("voteMessage failed: ", err);
		res.status(500).send("Error updating the message score in the database.");
	}
});


/*******************************************************************************
									SEARCH
*******************************************************************************/

// ...

/*******************************************************************************
									LISTEN
*******************************************************************************/

// make the app listen
app.listen(port, host, () => {
	console.log(`Database API Server started on http://${host}:${port}`);
});

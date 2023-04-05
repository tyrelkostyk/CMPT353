// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Project (Database API Node.js Server)
// April 6 2023

/*******************************************************************************
						  	DEFINITIONS & INCLUDES
*******************************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const mySql = require('mysql');
const cors = require('cors');

const port = process.env.API_SERVER_PORT || 3001;
const host = '0.0.0.0';
// const host = 'localhost';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const databaseName = "db";
const accountTableName = "accounts";
const channelTableName = "channels";
const messageTableName = "messages";
const voteTableName = "votes";
const replyTableName = "replies";

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
		username	VARCHAR(100) NOT NULL,
		password	VARCHAR(100) NOT NULL,
		displayName	VARCHAR(100) NOT NULL,
		PRIMARY KEY (username)
	)`;

	// query to create channel table
	const createChannelTableQuery = `CREATE TABLE IF NOT EXISTS ${channelTableName} (
		id			INT UNSIGNED NOT NULL auto_increment,
		name		VARCHAR(100) NOT NULL,
		description	VARCHAR(100) NOT NULL,
		PRIMARY KEY (id)
	)`;

	// query to create message table
	const createMessageTableQuery = `CREATE TABLE IF NOT EXISTS ${messageTableName} (
		id			INT UNSIGNED NOT NULL auto_increment,
		author		VARCHAR(100) NOT NULL,
		channelId	VARCHAR(100) NOT NULL,
		text		VARCHAR(100) NOT NULL,
		score		INT UNSIGNED NOT NULL,
		PRIMARY KEY (id)
	)`;

	// query to create votes table
	const createVotesTableQuery = `CREATE TABLE IF NOT EXISTS ${voteTableName} (
		id			INT UNSIGNED NOT NULL auto_increment,
		username	VARCHAR(100) NOT NULL,
		messageId	VARCHAR(100) NOT NULL,
		vote		VARCHAR(100) NOT NULL,
		PRIMARY KEY (id),
		UNIQUE KEY (username, messageId)
	)`;

	// query to create reply table
	const createReplyTableQuery = `CREATE TABLE IF NOT EXISTS ${replyTableName} (
		id			INT UNSIGNED NOT NULL auto_increment,
		author		VARCHAR(100) NOT NULL,
		messageId	VARCHAR(100) NOT NULL,
		text		VARCHAR(100) NOT NULL,
		PRIMARY KEY (id)
	)`;

	// create the tables
	try {
		await asyncQuery(createAccountTableQuery);
		console.log("Created user accounts table");

		await asyncQuery(createChannelTableQuery);
		console.log("Created channels table");

		await asyncQuery(createMessageTableQuery);
		console.log("Created messages table");

		await asyncQuery(createVotesTableQuery);
		console.log("Created votes table");

		await asyncQuery(createReplyTableQuery);
		console.log("Created replies table");

	} catch (err) {
		console.error("Failed to create tables: ", err);
		return;
	}
}

// connect to the DB after waiting 5s
const initDelay = 10000;
setTimeout(() => { initDb(); }, initDelay);


/*******************************************************************************
									ACCOUNTS
*******************************************************************************/

// Create a new channel
app.post('/api/register', async (req, res) => {
	const { username, password, displayName } = req.body;

	console.log('POST (register) -> Diplay name: ' + displayName + ' Username: ' + username);

	// insert new account into accounts table
	const insertQuery = `INSERT INTO ${accountTableName} (username, password, displayName)
						VALUES ('${username}', '${password}, '${displayName}') `;

	try {
		await asyncQuery(insertQuery);
		console.log("Registered account: " + username + ":" + displayName);
		res.json({ answer: "Registered account successfully!" });

	} catch (err) {
		console.error("Failed to register account: ", err);
		res.status(500).send("Error registering new user into the database.");
	}
});

/*******************************************************************************
									CHANNELS
*******************************************************************************/

// Create a new channel
app.post('/api/addChannel', async (req, res) => {
	const { name, description } = req.body;

	console.log('POST (create channel) -> Name: ' + name + ' Description: ' + description);

	// insert new channel into channel table
	const insertQuery = `INSERT INTO ${channelTableName} (name, description)
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

	console.log('POST (add message) -> channelId: ' + channelId + ' Text: ' + text + ' author: ' + author);

	// insert new message into message table
	const insertQuery = `INSERT INTO ${messageTableName} (author, channelId, text, score)
						VALUES ('${author}', '${channelId}', '${text}', '${0}') `;

	try {
		await asyncQuery(insertQuery);
		console.log("User " + author + " added message " + channelId + ":" + text);
		res.json({ answer: "Added message successfully!" });

	} catch (err) {
		console.error("Failed to add message: ", err);
		res.status(500).send("Error adding message into the database.");
	}
});


// Return all messages in a channel
app.get('/api/getMessages/:channelId', async (req, res) => {
	const channelId = req.params.channelId;

	console.log('GET (all messages) -> channelId: ' + channelId);

	// select from table
	const selectQuery = `SELECT * FROM ${messageTableName} WHERE channelId = ${channelId}`;

	try {
		result = await asyncQuery(selectQuery);
		const response = JSON.parse(JSON.stringify(result));
		console.log("Retrieved Messages from (" + channelId + "): ", response);
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

	console.log('POST (add reply) -> messageId: ' + messageId + ' Text: ' + text + ' author: ' + author);

	// insert new reply into reply table
	const insertQuery = `INSERT INTO ${replyTableName} (author, messageId, text, score)
						VALUES ('${author}', '${messageId}', '${text}', '${0}') `;

	try {
		await asyncQuery(insertQuery);
		console.log("User " + author + " added reply " + messageId + ":" + text);
		res.json({ answer: "Added reply successfully!" });

	} catch (err) {
		console.error("Failed to add reply: ", err);
		res.status(500).send("Error adding reply into the database.");
	}
});


// Return all replies to a post
app.get('/api/getReplies/:messageId', async (req, res) => {
	const messageId = req.params.messageId;

	console.log('GET (all replies) -> messageId: ' + messageId);

	// select from table
	const selectQuery = `SELECT * FROM ${replyTableName} WHERE messageId = ${messageId}`;

	try {
		result = await asyncQuery(selectQuery);
		const response = JSON.parse(JSON.stringify(result));
		console.log("Retrieved Replies from (" + messageId + "): ", response);
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

	console.log('PUT (add vote) -> messageId: ' + messageId + ' vote: ' + vote);

	const username = "steve";	// TODO: use actual username
	// insert/update vote in votes table
	const updateVoteQuery = `INSERT INTO ${voteTableName} (username, messageId, vote)
							 VALUES (${username, messageId, vote})
							 ON DUPLICATE KEY UPDATE vote = ${vote}`;

	try {
		await asyncQuery(updateVoteQuery);
		console.log("Recorded vote(" + vote + ") on message: " + messageId);
		// continue...

	} catch (err) {
		console.log("voteMessage failed: ", err);
		res.status(500).send("Error recording the vote in the database.");
	}

	// update message score in messages table
	const updateScoreQuery = `UPDATE ${messageTableName} SET score = score + ${voteValue} WHERE id = ${messageId}`;

	try {
		await asyncQuery(updateScoreQuery);
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

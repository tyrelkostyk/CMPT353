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
const jwt = require('jsonwebtoken');

const port = process.env.API_SERVER_PORT || 3001;
const host = '0.0.0.0';
// const host = 'localhost';

const SECRET_KEY = process.env.API_SECRET_KEY || 'shhh'

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

// Generate a unique JWT authentication token for a user
function generateToken(user) {
	const payload = {
		username: user.username,
		displayName: user.displayName
	};

	const options = {
		expiresIn: '24h'
	};

	return jwt.sign(payload, SECRET_KEY, options);
}

// Authenticate a JWT token (middleware function)
function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).send('Incomplete or missing auth header provided.');
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, SECRET_KEY, (err, decoded) => {
		if (err) {
			return res.status(401).send('Invalid token.');
		}

		// continue to the route, providing the user payload
		req.user = decoded;
		next();
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

// Register a new user
app.post('/api/register', async (req, res) => {
	const { username, password, displayName } = req.body;

	console.log('POST (register) -> Diplay name: ' + displayName + ' Username: ' + username);

	// insert new account into accounts table
	const insertQuery = `INSERT INTO ${accountTableName}
						 (username, password, displayName)
						 VALUES ('${username}', '${password}', '${displayName}') `;

	try {
		await asyncQuery(insertQuery);
		console.log("Registered account: " + username + ":" + displayName);
		res.json({ answer: "Registered account successfully!" });

	} catch (err) {
		console.error("Failed to register account: ", err);
		res.status(500).send("Error registering new user into the database.");
	}
});


// allow a user to sign in
app.post('/api/login', async (req, res) => {
	const { username, password } = req.body;

	console.log('POST (login) -> Username: ' + username);

	// check the database for this user
 	const selectUserQuery = `SELECT * FROM ${accountTableName}
 							 WHERE username = '${username}' AND
 							 password = '${password}'`;

	try {
		response = await asyncQuery(selectUserQuery);

		// user exists (with this correct username & password)
		if (response.length) {
			console.log("User Signed In: " + username);
			const token = generateToken(response[0]);
			res.json({ answer: "Signed in successfully!", token });

		// incorrect username or password
		} else {
			console.error("Failed to sign in (incorrect user/password)");
			res.status(500).send("incorrect username or password.");
		}

	} catch (err) {
		console.error("Failed to sign in: ", err);
		res.status(500).send("Error retrieving user account from the database.");
	}
});


/*******************************************************************************
									CHANNELS
*******************************************************************************/

// Create a new channel
app.post('/api/addChannel', authenticate, async (req, res) => {
	const { name, description } = req.body;

	console.log('POST (create channel) -> Name: ' + name + ' Description: ' + description);

	// insert new channel into channel table
	const insertQuery = `INSERT INTO ${channelTableName} (name, description)
						 VALUES ('${name}', '${description}')`;

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
app.get('/api/getChannels', authenticate, async (req, res) => {

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
		res.status(500).send("Error querying the database for channels.");
	}
});


/*******************************************************************************
									MESSAGES
*******************************************************************************/

// Add a new message to a channel
app.post('/api/addMessage/:channelId', authenticate, async (req, res) => {
	const channelId = req.params.channelId;
    const { text } = req.body;

	const author = req.user.displayName;

	console.log('POST (add message) -> channelId: ' + channelId + ' Text: ' + text + ' author: ' + author);

	// insert new message into message table
	const insertQuery = `INSERT INTO ${messageTableName}
						 (author, channelId, text, score)
						 VALUES ('${author}', ${channelId}, '${text}', ${0}) `;

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
app.get('/api/getMessages/:channelId', authenticate, async (req, res) => {
	const channelId = req.params.channelId;

	console.log('GET (all messages) -> channelId: ' + channelId);

	// select from table
	const selectQuery = `SELECT * FROM ${messageTableName}
						 WHERE channelId = ${channelId}`;

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
app.post('/api/addReply/:messageId', authenticate, async (req, res) => {
	const messageId = req.params.messageId;
    const { text } = req.body;

	const author = req.user.displayName;

	console.log('POST (add reply) -> messageId: ' + messageId + ' Text: ' + text + ' author: ' + author);

	// insert new reply into reply table
	const insertQuery = `INSERT INTO ${replyTableName} (author, messageId, text, score)
						 VALUES ('${author}', '${messageId}', '${text}', ${0}) `;

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
app.get('/api/getReplies/:messageId', authenticate, async (req, res) => {
	const messageId = req.params.messageId;

	console.log('GET (all replies) -> messageId: ' + messageId);

	// select from table
	const selectQuery = `SELECT * FROM ${replyTableName}
						 WHERE messageId = ${messageId}`;

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

app.put('/api/voteMessage/:messageId/:vote', authenticate,  async (req, res) => {
	const { messageId, vote } = req.params;

	const username = req.user.username;

	console.log('PUT (add vote) -> messageId: ' + messageId + ' vote: ' + vote);

	if (vote != "up" && vote != "down") {
		console.log("voteMessage failed (invalid param): " + vote);
		res.status(500).send("Invalid vote given.");
	}

	// check for previous votes on this message from this user
	const checkVoteQuery = `SELECT vote FROM ${voteTableName}
							WHERE username = '${username}' AND
							messageId = ${messageId}`;

	try {
		const checkVoteResult = await asyncQuery(checkVoteQuery);

		// a vote already exists (for this user & message)
		if (checkVoteResult.length) {

			// case 1 - same vote i.e. remove this vote
			if (checkVoteResult[0].vote == vote) {

				// remove the existing vote from database
				const removeVoteQuery = `DELETE FROM ${voteTableName}
										 WHERE username = '${username}' AND
										 messageId = ${messageId}`;
				const removeVoterResult = await asyncQuery(removeVoteQuery);

				// update message score in messages table (remove previous vote)
				const voteValue = (vote == "up") ? 1 : -1;
				const updateScoreQuery = `UPDATE ${messageTableName}
										  SET score = score - ${voteValue}
										  WHERE id = ${messageId}`;
				const updateScoreResult = await asyncQuery(updateScoreQuery);

				res.json({ answer: "Vote removed successfully!" });

			// case 2 - different vote i.e. flip vote
			} else {

				// update vote in database
				const updateVoteQuery = `UPDATE ${voteTableName}
										 SET vote = '${vote}'
										 WHERE username = '${username}' AND
			 							 messageId = ${messageId}`;
				const updateVoteResult = await asyncQuery(updateVoteQuery);

				// update message score in messages table (flip previous vote)
				const voteValue = (vote == "up") ? 2 : -2;
				const updateScoreQuery = `UPDATE ${messageTableName}
										  SET score = score + ${voteValue}
										  WHERE id = ${messageId}`;
				const updateScoreResult = await asyncQuery(updateScoreQuery);

				res.json({ answer: "Vote changed successfully!" });
			}

		// no vote exists yet (for this user & message)
		} else {

			// insert new vote into database
			const insertVoteQuery = `INSERT INTO ${voteTableName} (username, messageId, vote)
									 VALUES ('${username}', ${messageId}, '${vote}')`;
			const insertVoteResult = await asyncQuery(insertVoteQuery);

			// update message score in messages table
			const voteValue = (vote == "up") ? 1 : -1;
			const updateScoreQuery = `UPDATE ${messageTableName}
									  SET score = score + ${voteValue}
									  WHERE id = ${messageId}`;
			const updateScoreResult = await asyncQuery(updateScoreQuery);

			res.json({ answer: "New vote cast successfully!" });
		}

	} catch (err) {
		console.log("voteMessage failed: ", err);
		res.status(500).send("Error recording vote in database.");
	}
});


/*******************************************************************************
									SEARCH
*******************************************************************************/

// Return list of all channels that meet a search criteria
app.get('/api/searchChannels', authenticate, async (req, res) => {
	const { search } = req.params;

	console.log('GET (search channels) for: ', search);

	// search the table
	const searchQuery = `SELECT * FROM ${channelTableName}
						 WHERE LOWER(name) LIKE '${search}'`;

	try {
		result = await asyncQuery(searchQuery);
		const response = JSON.parse(JSON.stringify(result));
		console.log("Retrieved Channels: ", response);
		res.json(response);

	} catch (err) {
		console.log("searchChannels failed: ", err);
		res.status(500).send("Error querying the database for channels.");
	}
});


// Return list of all messages that meet a search criteria
app.get('/api/searchMessages', authenticate, async (req, res) => {
	const { search } = req.params;

	console.log('GET (search messages) for: ', search);

	// search the table
	const searchQuery = `SELECT * FROM ${messageTableName}
						 WHERE LOWER(name) LIKE '${search}'`;

	try {
		result = await asyncQuery(searchQuery);
		const response = JSON.parse(JSON.stringify(result));
		console.log("Retrieved Messages: ", response);
		res.json(response);

	} catch (err) {
		console.log("searchMessages failed: ", err);
		res.status(500).send("Error querying the database for messages.");
	}
});


/*******************************************************************************
									LISTEN
*******************************************************************************/

// make the app listen
app.listen(port, host, () => {
	console.log(`Database API Server started on http://${host}:${port}`);
});

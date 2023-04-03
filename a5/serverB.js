// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Assignment 5 - Part B (Level 3 REST API)
// March 28 2023

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nano = require('nano')(process.env.COUCHDB_URL);

const port = 3000;
const host = '0.0.0.0';
// const host = 'localhost';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const postsDbName = "posts_database";
const commentsDbName = "comments_database";
const postsDb = nano.use(postsDbName);
const commentsDb = nano.use(commentsDbName);

// create the couchdb databases if it doesn't exist
async function initDb() {
	try {
		// get list of all existing databases
		const dbList = await nano.db.list();

		// create posts db if it doesn't exist
		if (!dbList.includes(postsDbName)) {
			await nano.db.create(postsDbName);
			console.log(`${postsDbName} created!`);
		} else {
			console.log(`${postsDbName} already exists; continuing...`);
		}

		// create comments db if it doesn't exist
		if (!dbList.includes(commentsDbName)) {
			await nano.db.create(commentsDbName);
			console.log(`${commentsDbName} created!`);
		} else {
			console.log(`${commentsDbName} already exists; continuing...`);
		}

	} catch (error) {
		console.error('Error creating databases: ', error);
	}
}

initDb();


// main page entry point
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/TestRestLevel3.html')
});


// POST method that adds a new post to the posts DB
app.post('/addPost', async (req, res) => {
    const { postId, postTopic, postData } = req.body;
	const post = {
		_id: postId,
		topic: postTopic,
		data: postData
	};

	console.log('POST Received! ID: ' + postId +
					       ' Topic: ' + postTopic +
						    ' Data: ' + postData);

	try {
		const result = await postsDb.insert(post);
		console.log('Inserted Post');
		res.json({
			answer: 'wrote successfully!',
			link: {
				rel: 'read posts',
				href: '/getPosts',
				method: 'GET'
			}
		});
	} catch (error) {
		console.error('Failed to insert post: ', error);
		res.status(500).json({ answer: 'Inserting post failed.'});
	}
});


// GET method that returns all the posts in the posts DB
app.get('/getPosts', async (req, res) => {
	try {
		const result = await postsDb.list({ include_docs: true });
		console.log('Sending posts: ', result.rows);
		// simplify the data and then send it
		res.json(result.rows.map((row) => {
			const { _id, topic, data } = row.doc;
			// TODO: include a link to GET the comments for each post (1 link/row)
			return { postId: _id, postTopic: topic, postData: data };
		}));
	} catch (error) {
		console.log("getPosts failed: ", error);
		res.status(500).json({ answer: 'Getting all posts failed.'});
	}
});


// POST method that adds a new comment to the comments DB, for a specific post
app.post('/addComment/:postId', async (req, res) => {
	const postId = req.params.postId;
	const {commentId, commentText } = req.body;
	const comment = {
		_id: commentId,
		post: postId,
		text: commentText
	};

	console.log('Comment Received! ID: ' + commentId +
							   ' Post: ' + postId +
							   ' Text: ' + commentText);

	try {
		const result = await commentsDb.insert(comment);
		console.log('Inserted Comment');
		// TODO: include a link to GET all of the comments for this post (1 link/msg)
		res.json({ answer: 'wrote successfully!' });
	} catch (error) {
		console.error('Failed to insert comment: ', error);
		res.status(500).json({ answer: 'Inserting comment failed.'});
	}
});


// GET method that returns all the comments (for a specific post) in the comment DB
app.get('/getComments/:postId', async (req, res) => {
	const postId = req.params.postId;

	const query = {
		selector: {
			post: { $eq: postId }
		}
	};

	try {
		const result = await commentsDb.find(query);
		console.log('Sending comments for postId (' + postId + '): ', result.docs);
		// simplify the data and then send it
		res.json(result.docs.map((doc) => {
			const { _id, post, text } = doc;
			// TODO: include a POST link to add a comment for this post (1 link/msg)
			return { commentId: _id, commentText: text };
		}));
	} catch (error) {
		console.log("getComments failed: ", error);
		res.status(500).json({ answer: 'Getting all comments failed.'});
	}
});


// make the app listen
app.listen(port, host, () => {
	console.log(`Server started on http://${host}:${port}`);
});

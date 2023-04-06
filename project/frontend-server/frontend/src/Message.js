import React, { useState, useEffect } from 'react';

import './Message.css';

const API_BASE_URL = 'http://localhost:3001';


function Message({message}) {
	const [replies, setReplies] = useState([]);
	const [text, setText] = useState("");

	// get all replies from the database
	async function fetchReplies() {
		try {
			const url = `${API_BASE_URL}/api/getReplies/${message.id}`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			setReplies(data);
			console.log("Replies received: ", data);
		} catch (err) {
			console.error("Error fetching replies: ", err);
		}
	}

	// add a new reply to the database
	async function addReply() {
		try {
			const url = `${API_BASE_URL}/api/addReply/${message.id}`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ 'text': text })
			});
			const data = await response.json();
			console.log("Added a reply! ", data);
			fetchReplies();
		} catch (err) {
			console.error("Error adding a new reply: ", err);
		}
	}

	// update this message's score (add an upvote)
	async function addUpvote() {
		try {
			const url = `${API_BASE_URL}/api/voteMessage/${message.id}/up`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});
			const data = await response.json();
			console.log("Added an upvote! ", data);
			// TODO: update messages
		} catch (err) {
			console.error("Error adding a new reply: ", err);
		}
	}

	// update this message's score (add a downvote)
	async function addDownvote() {
		try {
			const url = `${API_BASE_URL}/api/voteMessage/${message.id}/down`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});
			const data = await response.json();
			console.log("Added a downvote! ", data);
			// TODO: update messages
		} catch (err) {
			console.error("Error adding a new reply: ", err);
		}
	}

	// fetch messages when element is mounted
	useEffect(() => { fetchReplies(); }, []);

	return (
	<div>
	<div className="message">
		<h3>{message.author} [{message.score}]:</h3>
		<h4>{message.text}</h4>
		<div>
			<button onClick={addUpvote}>Upvote</button>
			<button onClick={addDownvote}>Downvote</button>
		</div>
	</div>
	<div className="replies-container">
		<ul>
			{replies.map((reply) => (
				<li key={reply.id}>
					<h5>{reply.author}:  {reply.text}</h5>
				</li>
			))}
		</ul>
	</div>
	<div className="add-reply-container">
		<input
			type="text"
			placeholder="Reply Text..."
			value={text}
			onChange={e => setText(e.target.value)} />
		<button onClick={addReply}> Send Reply </button>
	</div>
	</div>
	)
}

export default Message;

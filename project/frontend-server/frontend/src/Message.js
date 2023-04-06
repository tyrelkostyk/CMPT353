import React, { useState, useEffect } from 'react';

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

	// fetch messages when element is mounted
	useEffect(() => { fetchReplies(); }, []);

	return (
	<div>
	<div className="message">
		<h3>{message.author} : {message.text}</h3>
	</div>
	<div className="replies-container">
		<h4>Replies</h4>
		<ul>
			{replies.map((reply) => (
				<li key={reply.id}>
					{reply.author} : {reply.text}
				</li>
			))}
		</ul>
	</div>
	<div className="add-reply-container">
		<h4>Add a new reply</h4>
		<input
			type="text"
			placeholder="Reply Text..."
			value={text}
			onChange={e => setText(e.target.value)} />
		<div className="add-reply-button-container">
			<button onClick={addReply}> Send Reply </button>
		</div>
	</div>
	</div>
	)
}

export default Message;

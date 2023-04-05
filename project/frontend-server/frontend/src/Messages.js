import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001';


function Message({message}) {
	const [replies, setReplies] = useState([]);

	// get all replies from the database
	async function fetchReplies() {
		try {
			var url = `${API_BASE_URL}/api/getReplies/${message.id}`;
			const response = await fetch(url, { method: 'GET' });
			const data = await response.json();
			setReplies(data);
			console.log("Replies received: ", data);
		} catch (err) {
			console.error("Error fetching replies: ", err);
		}
	}

	// fetch messages when element is mounted
	useEffect(() => { fetchReplies(); }, []);

	return (
	<div>
	<div className="message"
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
	</div>
	)
}

export default Message;

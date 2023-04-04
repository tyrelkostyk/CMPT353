import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://api-server:3001';


function ChannelView(props) {
	const [messages, 	setMessages] 	= useState([]);
	const { channelId } = props.match.params;

	// get all messages from the database
	async function fetchMessages() {
		try {
			var url = `${API_BASE_URL}/api/getMessages/${channelId}`;
			const response = await fetch(url, { method: 'GET' });
			const data = await response.json();
			setMessages(data);
			console.log("Messages received: ", data);
		} catch (err) {
			console.error("Error fetching messages: ", err);
		}
	}

	// fetch messages when element is mounted
	useEffect(() => { fetchMessages(); }, []);

	return (
	<div>
		<h2>Messages for Channel #{channelId} </h2>
		<ul>
			{messages.map((message) => (
				<li key={message.id}>
					{message.text}
				</li>
			))}
		</ul>
	</div>
	)
}

export default ChannelView;

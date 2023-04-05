import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001';


function ChannelView(props) {
	const [messages, setMessages] = useState([]);
	const { channelId } = useParams();

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

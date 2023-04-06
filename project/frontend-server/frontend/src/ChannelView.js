import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Message from './Message';

import './ChannelView.css';

const API_BASE_URL = 'http://localhost:3001';


function ChannelView(props) {
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");

	const { channelId } = useParams();

	// get all messages from the database
	async function fetchMessages() {
		try {
			const url = `${API_BASE_URL}/api/getMessages/${channelId}`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			setMessages(data);
			console.log("Messages received: ", data);
		} catch (err) {
			console.error("Error fetching messages: ", err);
		}
	}

	// add a new message to the database
	async function addMessage() {
		try {
			const url = `${API_BASE_URL}/api/addMessage/${channelId}`;
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
			console.log("Added a message! ", data);
			fetchMessages();
		} catch (err) {
			console.error("Error adding a new message: ", err);
		}
	}

	// fetch messages when element is mounted
	useEffect(() => { fetchMessages(); }, [channelId]);

	return (
	<div className="channel-view-container">
	<div className="message-container">
		<h2>Messages for Channel #{channelId} </h2>
		<ul>
			{messages.map((message) => (
				<li key={message.id}>
					{<Message message={message}/>}
				</li>
			))}
		</ul>
	</div>
	<div className="add-message-container">
		<h4>Add a new message</h4>
		<input
			type="text"
			placeholder="Message Text..."
			value={text}
			onChange={e => setText(e.target.value)} />
		<button onClick={addMessage}> Send </button>
	</div>
	</div>
	)
}

export default ChannelView;

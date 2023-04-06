import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './ChannelList.css';

const API_BASE_URL = 'http://localhost:3001';


function ChannelList() {
	const [channels, 	setChannels] 	= useState([]);
	const [name, 		setName] 		= useState("");
	const [description,	setDescription]	= useState("");

	// get all channels from the database
	async function fetchChannels() {
		try {
			const url = `${API_BASE_URL}/api/getChannels`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			setChannels(data);
			console.log(data);
		} catch (err) {
			console.error("Error fetching all channels: ", err);
		}
	}

	// add a new channel to the database
	async function addChannel() {
		try {
			const url = `${API_BASE_URL}/api/addChannel`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ 'name': name, 'description': description })
			});
			const data = await response.json();
			console.log("Added a channel! ", data);
			fetchChannels();
		} catch (err) {
			console.error("Error creating a new channel: ", err);
		}
	}

	// fetch channels when element is mounted
	useEffect(() => { fetchChannels(); }, []);

	return (
	<div className="channel-list-container">
		<div className="auth-button">
			<Link to="/"> <button> Sign In / Register </button> </Link>
		</div>
		<div className="home-button">
			<Link to="/auth"> <button> Home </button> </Link>
		</div>
		<div className="search-button">
			<Link to="/search"> <button> Search </button> </Link>
		</div>
		<h2>Channels</h2>
		<div className="refreh-button-container">
			<button onClick={fetchChannels}> Refresh List </button>
		</div>
		<ul className="channel-list">
			{channels.map((channel) => (
				<li key={channel.id}>
					<Link to={`/channelView/${channel.id}`}>{channel.name}</Link>
				</li>
			))}
		</ul>
		<div className="add-channel-container">
			<div className="add-channel-button-container">
				<button onClick={addChannel}> Create a channel! </button>
			</div>
			<input
				type="text"
				placeholder="Channel Name..."
				value={name}
				onChange={e => setName(e.target.value)} />
			<input
				type="text"
				placeholder="Channel Description..."
				value={description}
				onChange={e => setDescription(e.target.value)} />
		</div>
	</div>
	)
}

export default ChannelList;

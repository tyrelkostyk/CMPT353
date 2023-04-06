import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001';


function Search() {
	const [channelSearch, setChannelSearch] = useState("");
	const [channelResults, setChannelResults] = useState([]);

	const [messageSearch, setMessageSearch] = useState("");
	const [messageResults, setMessageResults] = useState([]);

	// get all channels (from search results) from the database
	async function searchChannels() {
		try {
			var url = `${API_BASE_URL}/api/searchChannels/${channelSearch}`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			setChannelResults(data);
			console.log("Searched Channels: ", data);
		} catch (err) {
			console.error("Error searching channels: ", err);
		}
	}

	// get all channels (from search results) from the database
	async function searchMessages() {
		try {
			var url = `${API_BASE_URL}/api/searchMessages/${messageSearch}`;
			const token = localStorage.getItem('token');
			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			setMessageResults(data);
			console.log("Searched Messages: ", data);
		} catch (err) {
			console.error("Error searching messages: ", err);
		}
	}

	return (
	<div>
		<h2> Welcome to the search page! </h2>
		<h4> Search by Channel, Message, Reply, or Author </h4>
		<div className="search-channels-container">
			<h3>Search Channels</h3>
			<input
				type="text"
				placeholder="Search Channels..."
				value={channelSearch}
				onChange={e => setChannelSearch(e.target.value)} />
			<div className="search-channels-button-container">
				<button onClick={searchChannels}> Search Channels </button>
			</div>
			<ul className="search-channels-results-list">
				{channelResults.map((channel) => (
					<li key={channel.id}>
						<Link to={`/channelView/${channel.id}`}>{channel.name}</Link>
					</li>
				))}
			</ul>
		</div>
		<div className="search-messages-container">
			<h3>Search Messages</h3>
			<input
				type="text"
				placeholder="Search Messages..."
				value={messageSearch}
				onChange={e => setMessageSearch(e.target.value)} />
			<div className="search-messages-button-container">
				<button onClick={searchMessages}> Search Messages </button>
			</div>
			<ul className="search-messages-results-list">
				{messageResults.map((message) => (
					<li key={message.id}>
						<Link to={`/channelView/${message.channelId}`}>{message.author} : {message.text}</Link>
					</li>
				))}
			</ul>
		</div>
	</div>
	)
}

export default Search;

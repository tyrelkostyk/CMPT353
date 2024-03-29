import './App.css';

import { useState } from 'react';
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Landing from './Landing';
import ShowPosts from './ShowPosts';
import AddPosts from './AddPosts';

function App() {

	const [dbStatus, setDbStatus] = useState("not ready...");

	function updateStatus(isReady) {
		if (isReady) {
			setDbStatus("ready!")
		} else {
			setDbStatus("not ready...")
		}
	}

	return (
	<div className="App">
		<header className="App-header">
			<div>
			<Router>
			<Routes>
				<Route exact path='/' element={<Landing update = {updateStatus} />} />
				<Route path="/showPosts" element={<ShowPosts />} />
	            <Route path="/addPosts" element={ <AddPosts /> } />
			</Routes>
			<Link to="/showPosts">  <button> Show Posts (Server {dbStatus}) </button> </Link>
	        <Link to="/addPosts">  <button> Add Posts </button>   </Link>
			<Link to="/">  <button> Home </button> </Link>
			</Router>
			</div>
		</header>
	</div>
	);
}

export default App;

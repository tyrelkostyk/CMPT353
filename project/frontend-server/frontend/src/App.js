import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Landing from './Landing';
import ChannelList from './ChannelList';
import ChannelView from './ChannelView';

import './App.css';


function App() {
	return (
	<div className="App">

	<ChannelList />

	<div className="main-content">
	<Router>
		<Routes>
		<Route exact path="/" element={<Landing />} />
		<Route path="/getMessages/:channelId" element={<ChannelView />} />
		</Routes>
	</Router>
	</div>

	</div>
	);
}

export default App;

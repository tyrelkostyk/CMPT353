import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Landing from './Landing';
import ChannelList from './ChannelList';
import ChannelView from './ChannelView';

import './App.css';


function App() {
	return (
	<div className="App">
	<Router>

	<ChannelList />
	<div className="main-content">
		<Routes>
		<Route exact path="/" element={<Landing />} />
		<Route path="/channelView/:channelId" element={<ChannelView />} />
		</Routes>
	</div>

	</Router>
	</div>
	);
}

export default App;

import './App.css';

import { useState } from 'react';
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// import {Landing} from './Landing';
// import {ShowPosts} from './ShowPosts';
// import {AddPosts} from './AddPosts';


function App() {

	const [message, setMessage] = useState('');

	// const [getList, setList] = useState([]);
    // if(getList.length <1) {fetch('http://localhost:81/data').then(response => response.json()).then(response => setList(response))};

	function handleClick() {
      // fetch('/api/action')
      //   .then(response => response.json())
      //   .then(data => setMessage(data.message))
      //   .catch(error => {
      //     console.error(error);
      //   });
		var url = '/api/init';
		fetch(url, {
			method: 'GET',
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				setMessage(data.answer);
				// document.getElementById("init-response").value = data.answer;
		})
    }

	return (
	<div className="App">
	<header className="App-header">
	<div>

	<button onClick={handleClick}>Init Database</button>
	<p>{message}</p>

	// <Router>
	// 	<Link to="/showPosts">  <button> Show Posts </button> </Link>
	// 	<Link to="/addPosts">  <button> Add Posts </button>   </Link>
	// 	<Routes>
	// 		<Route exact path='/' element={<Landing/>} />
	// 		<Route path="/showPosts" element={<ShowPosts get = {getList}/>} />
	// 		<Route path="/addPosts" element={ <AddPosts set = {setList} /> } />
	// 	</Routes>
	// </Router>
	</div>
	</header>
	</div>
	);
}

export default App;

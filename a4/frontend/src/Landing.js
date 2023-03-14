import React, { Component } from 'react';
import { useState } from 'react';


function Landing() {

	const [initResponse, setInitResponse] = useState('');

	function handleInitClick() {
		var url = '/api/init';
		fetch(url, {
			method: 'GET',
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				setInitResponse(data.answer);
		})
    }

	return (
		<div>
			<h3>Welcome to Tyrel's React App! Pls let me graduate :')</h3>
			<h1>This is my last course</h1>
			<p>pls</p>
			<br/><br/><br/>
			<button onClick={handleInitClick}>Init Database</button>
			<p>{initResponse}</p>
		</div>
	);
}

export default Landing;

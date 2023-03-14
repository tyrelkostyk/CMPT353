import React, { Component } from 'react';
import { useState } from 'react';


function Landing(props) {

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
				if (data.answer == "Success!") {
					props.update(true);
				} else {
					props.update(false);
				}
		})
    }

	return (
		<div>
			<h3>Welcome to Tyrel's React App! Pls let me graduate :')</h3>
			<h4>This is my last course</h4>
			<h5>pls</h5>
			<br/><br/><br/>
			<button onClick={handleInitClick}>Init Database</button>
			<p>{initResponse}</p>
		</div>
	);
}

export default Landing;

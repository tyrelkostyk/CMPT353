import React from 'react';
import { useState } from 'react';

function AddPosts() {

	const [topic, setTopic] = useState('');
	const [data, setData]	= useState('');

	function addPost() {
		var url = '/api/addPost';
		fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 'topic': topic, 'data': data })
		})
			.then(response => response.json())
			.then(data => {
				console.log("post sent!");
				console.log(data);
		})
	}

	return (
		<>
		<h3>Add a Post</h3>
		<br />
		<input
			type="text"
			placeholder="TOPIC"
			value={topic}
			onChange={e => setTopic(e.target.value)} />
		<input
			type="text"
			placeholder="DATA"
			value={data}
			onChange={e => setData(e.target.value)} />
		<br />
		<button onClick={addPost}> Send the Post! </button>
		</>
	);
}

export default AddPosts;

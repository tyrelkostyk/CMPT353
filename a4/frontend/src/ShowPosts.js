import './ShowPosts.css';

import React, { Component } from 'react';
import { useState, useEffect } from 'react';

function ShowPosts() {

	const [posts, setPosts] = useState([]);

	function getPosts() {
		var url = '/api/getPosts';
		fetch(url, {
			method: 'GET',
		})
			.then(response => response.json())
			.then(data => {
				console.log("posts received!");
				console.log(data);
				if (Array.isArray(data)) {
		          setPosts(data);
		        } else {
		          console.error('Received data is not an array:', data);
		        }
		})
	}

	// automatically get all of the posts when this component loads
	useEffect(() => {
    	getPosts();
    }, []);

	return (
		<>
		{posts.length > 0 ? (
			posts.map(post => (
            <div className="container" key={post.id}>
                <h3> {post.id} </h3>
                <h3> {post.topic} </h3>
                <h3> {post.data} </h3>
            </div>
        	))
		) : (
			<div>
				<h3>No posts available :/</h3>
				<p> Try adding some! </p>
			</div>
      	)}
        </>
	);
}

export default ShowPosts;

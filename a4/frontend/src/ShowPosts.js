import './ShowPosts.css';

import React, { Component } from 'react';
import { useState } from 'react';


function ShowPosts(get) {
	return (
		<>
        {get.map(post => (
            <div className="container">
                <h3> {post.id} </h3>
                <h3> {post.text} </h3>
                <h3> {post.time} </h3>
            </div>

        ))}
        </>
	);
}

export default ShowPosts;

import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:3001';


function Auth() {
	const [usernameRegister, setUsernameRegister] = useState("");
	const [passwordRegister, setPasswordRegister] = useState("");
	const [displayName, setDisplayName] = useState("");

	const [usernameSignIn, setUsernameSignIn] = useState("");
	const [passwordSignIn, setPasswordSignIn] = useState("");

	// register i.e. add a new user to the database
	async function register() {
		try {
			const url = `${API_BASE_URL}/api/register`;
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					'username': usernameRegister,
					'password': passwordRegister,
					'displayName': displayName
				})
			});
			const data = await response.json();
			console.log(data);
		} catch (err) {
			console.error("Error registering new account: ", err);
		}
	}

	// log in to an existing account
	async function login() {
		try {
			const url = `${API_BASE_URL}/api/login`;
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					'username': usernameSignIn,
					'password': passwordSignIn
				})
			});
			const data = await response.json();
			console.log(data);
			// grab and store token in local storage
			if (data.token) {
				localStorage.setItem('token', data.token);
			}
		} catch (err) {
			console.error("Error signing in: ", err);
		}
	}

	return (
	<div className="auth-container">
		<div className="register-container">
		<h3> Register </h3>
			<div className="register-button-container">
				<button onClick={register}> Create a new account! </button>
			</div>
			<input
				type="text"
				placeholder="Username..."
				value={usernameRegister}
				onChange={e => setUsernameRegister(e.target.value)} />
			<input
				type="password"
				placeholder="Password..."
				value={passwordRegister}
				onChange={e => setPasswordRegister(e.target.value)} />
			<input
				type="text"
				placeholder="Display Name..."
				value={displayName}
				onChange={e => setDisplayName(e.target.value)} />
		</div>
		<br/><br/><br/><br/>
		<h3> Sign In </h3>
		<div className="login-container">
			<div className="login-button-container">
				<button onClick={login}> Sign in! </button>
			</div>
			<input
				type="text"
				placeholder="Username..."
				value={usernameSignIn}
				onChange={e => setUsernameSignIn(e.target.value)} />
			<input
				type="password"
				placeholder="Password..."
				value={passwordSignIn}
				onChange={e => setPasswordSignIn(e.target.value)} />
		</div>
	</div>
	)
}

export default Auth;

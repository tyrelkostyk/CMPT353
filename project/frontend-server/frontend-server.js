// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Project (Frontend Node.js Server)
// April 6 2023

/*******************************************************************************
						  	DEFINITIONS & INCLUDES
*******************************************************************************/

const express = require('express');
const path = require('path');

const port = process.env.FRONTEND_SERVER_PORT || 3000;
const host = '0.0.0.0';
// const host = 'localhost';

const app = express();
const buildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(buildPath));


/*******************************************************************************
									ROUTES
*******************************************************************************/

// deliver the static ReactJS page
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});


/*******************************************************************************
									LISTEN
*******************************************************************************/

// make the app listen
app.listen(port, host, () => {
	console.log(`Frontend Server started on http://${host}:${port}`);
});

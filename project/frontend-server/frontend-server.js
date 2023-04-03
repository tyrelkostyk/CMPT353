// Tyrel Kostyk
// tck290, 11216033
// CMPT353 - Project (Frontend Node.js Server)
// April 6 2023

const express = require('express');
const path = require('path').join(__dirname, 'frontend', 'build');
// const cors = require('cors');	// TODO: do I need this?

const port = 3001;
const host = '0.0.0.0';
// const host = 'localhost';

const app = express();
app.use(express.static(path));
// app.use(cors());					// TODO: do I need this?

// deliver the static ReactJS page
app.get('*', (req,res) => {
  res.sendFile('index.html', {path});
});

// make the app listen
app.listen(port, host, () => {
	console.log(`Frontend Server started on http://${host}:${port}`);
});

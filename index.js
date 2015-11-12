// Import the fs module so that we can read in files.
var fs = require('fs');
// Import express to create and configure the HTTP server.
var express = require('express');

// Read in the text file and parse it for JSON.
var data = JSON.parse(fs.readFileSync('ratings.json','utf8'));
var data2 = JSON.parse(fs.readFileSync('ratings.json','utf8'));
// Create a HTTP server app.
var app = express();














// Start the server.
var server = app.listen(8000);

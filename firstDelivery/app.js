
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');

const root = __dirname;

var app = express();

// Maybe change to app router or just app for express use
// The CSS and IMGs are not working in the champ-select page

const serverStatic = (response,file)=>{
	const fileToServe = path.join(root,file);
	const stream = fs.createReadStream(fileToServe);

	console.log('serving...');
	
	stream.on('data',(chunk)=>{
		console.log( 'read:' + chunk);
		response.write(chunk);
	});
	stream.on('end',function(){
		response.end();
		console.log( 'done reading.');
	});
}

//routing
// ======================================

//print info on requests
app.use(function(req, res, next) {
	console.log("request for "+ req.method + " " + req.originalUrl);
	next();
});

//express public files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',  function(req, res, next) {
	console.log( 'serving a index');
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/char-select',  function(req, res, next) {
	console.log( 'serving a char-select');
	res.sendFile(path.join(__dirname, 'char-select.html'));
});

app.get('/fight',  function(req, res, next) {
	console.log( 'serving a fight');
	res.sendFile(path.join(__dirname, 'fight.html'));
});

app.get('/characther')




module.exports = app;
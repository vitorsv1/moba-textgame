
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const database = require('databaseManagment');

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
// check session
app.use(function(req, res, next) {
	if(!req.session.username & req.baseUrl != '/login')res.redirect('/login');
	else next();
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

app.get('/characterStats.json',  function(req, res, next) {
	console.log( 'serving a fight');
	res.sendFile(path.join(__dirname, 'characterStats.json'));
});


//user session and login
app.use(session({
	secret: 'chimichanga',
	resave: false,			// default value
	saveUninitialized: true // default value
}));

app.get('/login',(req,res)=>{
	let sess=req.session;
	console.log( 'serving a login');
	res.sendFile(path.join(__dirname, 'login.html'));

})

app.post('/login',(req,res)=>{
	let sess=req.session;
	// We assign username and password to sess.username and sess.pswd variables.
	// The data comes from the submitted HTML page.
	sess.username=req.body.username;
	sess.pswd=req.body.pass;
	console.log('User submitted this data:',sess);

	// validate the user and password here ... TO DO ... use mongoDB
	function checkUser(users){
		if(users[0] && users.username == sess.username && users.password == sess.password) res.redirect('./');
		else console.log("loging failed, dunno what else to do ");
	}
	database.findUser(sess.username, checkUser);
});

app.get('/logout',(req,res)=>{
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/login');
		}
	});
});


module.exports = app;
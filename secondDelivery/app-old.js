const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const database = require('./databaseManagment');
const bodyParser = require('body-parser');

const root = __dirname;

var app = express();

//user session and login
app.use(session({
	secret: 'chimichanga',
	resave: false,			// default value
	saveUninitialized: true // default value
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

//------pages that dont require beeing  logged in ---------------
//login page
app.get('/login',(req,res)=>{
	if(req.session.username) res.redirect('/');
	console.log( 'serving a login');
	res.sendFile(path.join(__dirname, 'login.html'));
});
//register page
app.get('/register',(req,res)=>{
	console.log( 'serving a register page');
	res.sendFile(path.join(__dirname, 'register.html'));
});


//check session
 app.use(function(req, res, next) {
 	if(req.method == 'GET')console.log("user sending request = " + req.session.username);
 	if(req.method == 'GET' && !req.session.username) res.redirect('/login');
 	else next();
 });

// standard routing
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


app.post('/login',(req,res)=>{
	let sess=req.session;
	sess.username=req.body.email;
	sess.pswd=req.body.pass;
	console.log('User submitted this data:',sess);

	// validate the user and password with mongoDB
	function checkUser(users){
		console.log("Checking valid user?")
		if(users[0] && users[0].username == sess.username && users[0].password == sess.pswd) {res.send('EverythingOK')}
		else res.send('You are a failure');
	}
	database.findUser(sess.username, checkUser);
});

app.post('/register',(req,res)=>{
	let sess=req.session;
	sess.username=req.body.email;
	sess.pswd=req.body.pass;
	console.log('User submitted this data:',sess);
	// make sure user doesnt exist already, should send an error msg but nope
	function checkUser(users){
		if(users[0])console.log('tried to register an existing user');
		else database.insertUser(sess.username, sess.pswd, function (response){
			if(response.result.ok)res.send('everythingOK');
			else console.log("error on inserting user :(");
		});
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
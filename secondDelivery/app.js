
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
//const database = require('databaseManagment');
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
//check session
// app.use(function(req, res, next) {
// 	console.log(req.session.username);
// 	if(!req.session.username) res.redirect('/login');
// 	else next();
// });

//express public files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',  function(req, res, next) {
	console.log( 'serving a index');
	//res.sendFile(path.join(__dirname, 'index.html'));
	let sess=req.session;
	//Session set when user Request our app via URL
	if(sess.email){
		/*
		* This line check Session existence.
		* If it existed will do some action.
		*/
		res.redirect('/index');
	}
	else{
		res.sendFile(path.join(__dirname, 'login.html'));
	}
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




app.get('/login',(req,res)=>{
	let sess=req.session;
	console.log( 'serving a login');
	res.sendFile(path.join(__dirname, 'login.html'));

});

app.get('/register',(req,res)=>{
	console.log( 'serving a register page');
	res.sendFile(path.join(__dirname, 'register.html'));
});


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

app.post('/register',(req,res)=>{
	let sess=req.session;
	// We assign username and password to sess.username and sess.pswd variables.
	// The data comes from the submitted HTML page.
	sess.username=req.body.username;
	sess.pswd=req.body.pass;
	console.log('User submitted this data:',sess);

	// validate the user and password here ... TO DO ... use mongoDB
	function checkUser(users){
		if(users[0] && users.username == sess.username && users.password == sess.password)console.log('tried to register an existing user');
		else database.insertUser(sess.username, sess.pswd, res.redirect('./'));
	}
	database.findUser(sess.username, checkUser);
});

app.get('/admin',(req,res)=>{
	let sess=req.session;
	if(sess.email){
		res.write('<h1>Hello '+sess.email+'</h1>');
		res.end('<a href="/logout">Logout</a>');
	} else{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href="/">Login</a>');
	}

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
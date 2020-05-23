const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const bodyParser = require('body-parser');

const database = require('./databaseManagment');
const fight = require('./serverFightManager');


const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers
} = require('./users')
const charSelected = null;

const root = __dirname;


//user session and login
app.use(session({
	secret: 'chimichanga',
	resave: false,			// default value
	saveUninitialized: true // default value
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//File server
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


//print info on requests
app.use(function(req, res, next) {
	console.log("request for "+ req.method + " " + req.originalUrl);
	next();
});

//express public files
app.use(express.static(path.join(__dirname, 'public')));

//------pages that dont require beeing  logged in ---------------

//login page !!!!!IT HAS TO BE  BEFORE CHECKING THAT THE SESSION EXISTS!!!!!!!!
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


//---------------  GET ---------------


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
	console.log( 'serving a character Stats');
	res.sendFile(path.join(__dirname, 'characterStats.json'));
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

app.get('/userStats', (req,res) =>{
	database.findUser(req.session.username, (user) =>{
		data = JSON.stringify({wins: user[0].wins, losses:user[0].losses, trophy:user[0].wins});
		console.log("sending user stats:");
		console.log(data);
		res.send(data);
	});
});


//----------------- POST -----------------
app.post('/login',(req,res)=>{
	let sess=req.session;
	sess.username=req.body.email;
	sess.pswd=req.body.pass;
	console.log('User submitted this data:',sess);

	// validate the user and password with mongoDB
	function checkUser(users){
		console.log("Checking valid user?")
		if(users[0] && users[0].username == sess.username && users[0].password == sess.pswd) {res.send('EverythingOK')}
		else {
			res.send('You are a failure');
			req.session.destroy(function(err){
				if(err){
					console.log(err);
				}
			});

		}
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


// ----------------- SOCKETS -----------------
rooms = new Array(); // -->{roomId, user1{username, char}, user2{username, char}}
io.on('connection', (socket) =>{
	console.log(`The user ${socket.id} is connected'`);

	socket.on('joinRoom', (message) => {
		console.log("joining a room");
		contentObj = JSON.parse(message);
		username = contentObj.user;
		char = contentObj.char;
		joinedRoom = rooms.find((present) =>{ return present.user2 == null});
		if(joinedRoom == undefined){ //createand join a new room if  all are full
			console.log("No rooms available, creating a new room");
			joinedRoom = {roomId: rooms.length, user1: { username: username, char: char}, user2 : null};
			rooms.push(joinedRoom);
			socket.join(joinedRoom.roomId);
		}
		else { //join an available room --> roomis full --> start a game
			joinedRoom.user2 = {username :username, char: char};
			socket.join(joinedRoom.roomId);
			console.log("Room full, starting game");

			game = fight.createFight(joinedRoom.user1.username, joinedRoom.user2.username, joinedRoom.user1.char, joinedRoom.user1.char);
			io.to(joinedRoom.roomId).send('start game', JSON.stringify({char1:joinedRoom.user1.char, char2 : joinedRoom.user1.char }));
			socket.emit('your turn');
		}

		console.log("joined a room");


		/*const numberUser = getRoomUsers(room);
		if (numberUser < 2) {
			const user = userJoin(socket.id, username, room);

			socket.join(user.room);

			socket.broadcast
				.to(user.room)
				.emit('message', `The user ${username} is connected'`);
		}
		else {
			socket.emit('roomFull', 'The fight has already begin here!');
		}*/
	});

	socket.on('new command',(message) =>{
		messageObj = JSON.parse(message);
		username = messageObj.username;
		command = messageObj.command;
		room = rooms.find((present) =>{ return present.user1 == username || present.user2 == username});
		io.to(room.roomId).emit('send command', command); // send comand to clients
		//update fight on database
		fight.getFight(username, (combat) => {
			try {
				fight.updateFight(username, combat, command);
			}catch (e) {
				let winner, losser;
				switch (e) {
					case 'player 1 won':
						winner = room.user1.username;
						losser = room.user2.username;
						break;
					case 'player 2 won':
						winner = room.user2.username;
						losser = room.user1.username;
						break;
					default: throw  e;
				}
				fight.finishFight(winner,losser);
				io.to(room.roomId).emit('game finished');
			}

		})

	});

	socket.on('new message', (message) => {
		messageObj = JSON.parse(message);
		username = messageObj.username;
		room = rooms.find((present) =>{ return present.user1 == username || present.user2 == username});
		io.to(room.roomId).emit('send command2', message); // send message to clients
	})
	/*
	socket.on('charSelect', name => {
		//SEND TO THE DATABASE WHAT CHAR SELECTED
		charSelected = name;
		console.log(name);
		console.log(charSelected);
	})

	socket.on('receivedMessage', data => {		
		
	})

	socket.on('sendMessage', data => {
		// Manage the data to send to database
		socket.emit('receivedMessage', {charSelected, data});
	})
	*/

	socket.on('disconnect', () => {
		//const user = userLeave(socket.id);

		/*if(user) {
			io.to(user.room).emit('message', `The user ${username} has left the game'`);
		}*/
		console.log("userr disconected");

	})
})

//--------------- PORT ---------------
var server = http.listen(3000, () => {
	console.log('server is running on port', server.address().port);
});
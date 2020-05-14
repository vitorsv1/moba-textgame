
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');

const root = __dirname;

var app = express();

app.use(express.static('public'));

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
};

// ======================================

let route = {
	routes : {},
	for: function(method,path,handler){
		this.routes[method+path] = handler;
	}
}


route.for('GET','/', (request,response) =>{
	console.log( 'serving a file');
	serverStatic(response,'index.html');
});

route.for('GET','/char-select', (request,response) =>{
	console.log( 'serving a file');
	serverStatic(response,'char-select.html');
});

route.for('GET','/fight', (request,response) =>{
	console.log( 'serving a file');
	serverStatic(response,'fight.html');
});

route.for('GET','/characterStats', (request,response) =>{
	console.log( 'serving a file');
	serverStatic(response,'characterStats.json');
});

/*
route.for('GET','/start', (request,response)=>{
	response.writeHead(200,{'Content-Type':'text/plain'});
	response.write('Hello');
	response.end();	
});

route.for('GET','/finish', (request,response)=>{
	response.writeHead(200,{'Content-Type':'text/plain'});
	response.write('Goodbye');
	response.end();	
});

route.for('POST','/echo', (request,response)=>{
	let incoming = "";
	
	request.on('data',(chunk)=>{
		incoming += chunk.toString();
	});
	
	request.on('end',()=>{
		response.writeHead(200,{'Content-Type':'text/plain'});
		response.write(incoming);
		response.end();	
	});
});
*/
// ======================================

const onRequest = (request,response)=>{
	let pathname = url.parse(request.url).pathname;
	console.log(`Request for ${request.method} - ${pathname} received.`);

	// a switch statement
	if (typeof route.routes[request.method+pathname] === 'function'){
		route.routes[request.method+pathname](request,response);
	} else {
		response.writeHead(200,{'Content-Type':'text/plain'});
		response.end('Four-O-Four NOT FOUND :P'); // is like write+end
	}
}

http.createServer( onRequest ).listen(9999);
console.log('Server has started...');

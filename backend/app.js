const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)

io.on('connection', function(conn){
	console.log("asdfsd")
	conn.emit('asdf', 'salu3')
});

server.listen(3000);

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {User, Users} = require('./Users.js')

app.use("/", express.static('static'));

io.on('connection', (conn) => {
	conn.on("join", function(data){
		const uuid = data[0];
		const nickname = data[1];
		const position = {
			x: data[2],
			y: data[3],
			z: data[4]
		}
		const rotation = {
			x: data[5],
			y: data[6],
			z: data[7]
		}
		
		console.info(`user ${nickname} connected`)
		Users[uuid] = new User(uuid, conn, nickname, position, rotation);

		conn.on('disconnect', function(asdf){
			delete Users[uuid];
			conn.broadcast.emit("leave", uuid)
			console.info(`\tuser ${nickname} disconnected`)
		});

		conn.on('move', function(data){
			const position = {
				x: data[0],
				y: data[1],
				z: data[2]
			}
			Users[uuid].position = position;
			conn.broadcast.emit("move", [uuid, position.x, position.y, position.z])
			console.info(`\tuser ${nickname} moved`)
		});
		conn.on('rotate', function(data){
			const rotation = {
				x: data[0],
				y: data[1],
				z: data[2]
			}
			Users[uuid].rotation = rotation;
			conn.broadcast.emit("rotate",[uuid, rotation.x, rotation.y, rotation.z])
		});
		
		conn.on('rename', function(nickname){
			Users[uuid].nickname = nickname;
			conn.broadcast.emit("rename", [uuid, nickname])
			console.info(`\tuser ${nickname} renamed`)
		});

		Object.keys(Users).forEach(function(_uuid){
			if(_uuid == uuid) return;
			const user = Users[_uuid];
			const nickname = user.nickname;
			const position = user.position;
			const rotation = user.position;
			conn.emit("add", [_uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z])
		});

		conn.broadcast.emit("add", [uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z])
	});
});

/*
setInterval(function(){

	for(uuid in users){
		const user = users[uuid]
		let filtered = Object.entries(users)
			.filter((a)=>a[0]!=uuid)
			.map((data)=>[data[0], data[1].position.x, data[1].position.y, data[1].position.z, data[1].rotation.x, data[1].rotation.y, data[1].rotation.z])

		let data = [];
		while(filtered.length > 0){
			data.push(...filtered[0])
		}

		user.conn.broadcast.emit("moving", data)
	}
},1000/60)
*/
server.listen(3000);

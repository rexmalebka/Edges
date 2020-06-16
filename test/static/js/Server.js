import {Users} from './Users.js';
import {User} from './Users.js';

export const Server = {
	init: function(){
		const server = this.socket;

		server.on("connect", function(){
			console.info("connected")
			let uuid = Math.random().toString(16).substr(2);
			const nickname = "adfasdf"
			const position = {x:0, y:2, z:-5};
			const rotation = {x:0, y:0, z:0};

			if(!localStorage.getItem("uuid")){
				localStorage.setItem("uuid", uuid)
			}else{
				uuid = localStorage.getItem("uuid")
			}

			Users.me = new User(uuid, nickname, position, rotation); 
			Users.me.move = function(position){
				Users.me.position = position;
				Server.socket.emit("move", [position.x, position.y, position.z])
			};
			Users.me.rotate = function(rotation){
				Users.me.rotation = rotation;    
				Server.socket.emit("rotate", [rotation.x, rotation.y, rotation.z])
			};
			Users.me.rename = function(name){
				Users.me.nickname = name;
				Server.socket.emit("rename", name)
				dispatchEvent(Users.me.renameUser)
			}
			dispatchEvent(Users.me.add)

			window.addEventListener('move', function(e){
				if(e.detail.uuid == Users.me.uuid){
					const position = Users.me.position;
					Users.me.move(position);
				}
			});



			server.emit("join", [uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z])
		});

		server.on("add", function(data){
			const uuid = data[0];
			const nickname = data[1];
			const position = {
				x: data[2],
				y: data[3],
				z: data[4],
			};

			const rotation = {
				x: data[5],
				y: data[6],
				z: data[7],
			};

			console.info(`adding user ${uuid} ${position} ${rotation}`)
			Users[uuid] = new User(uuid, nickname, position, rotation); 
			dispatchEvent(Users[uuid].add)
		});

		server.on("leave", function(uuid){
			dispatchEvent(Users[uuid].remove)
			delete Users[uuid];
		});

		server.on("move", function(data){
			const uuid = data[0];
			const position = {
				x: data[1],
				y: data[2],
				z: data[3]
			};

			Users[uuid].position = position;
			dispatchEvent(Users[uuid].moveForward);
		});
		server.on("rotate", function(data){
			const uuid = data[0];
			const rotation = {
				x: data[1],
				y: data[2],
				z: data[3]
			};
			Users[uuid].rotation = rotation;
		});
		server.on("rename", function(data){
			const uuid = data[0];
			const nickname = data[1];
			console.info(`user '${Users[uuid]}' renamed to '${nickname}'`)
			Users[uuid].nickname = nickname
			dispatchEvent(Users[uuid].renameUser)
		});
	},
	socket: io("http://localhost:3000"),
}

window.Users = Users
console.log(Users)

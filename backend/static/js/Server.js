import {Users} from './Users.js';
import {User} from './Users.js';

export const Server = {
	init: function(){
		let uuid = Math.random().toString(16).substr(2);
		
		if(!localStorage.getItem("uuid")){
			localStorage.setItem("uuid", uuid)
		}else{
			uuid = localStorage.getItem("uuid")
		}
		
		if(!Users.me){
			Users.me = new User(uuid, "---", {x:0, y:2, z:0}, {x:0, y:0, z:0}); 
		}

		const nickname = Users.me.nickname;
		const position = Users.me.position;
		const rotation = Users.me.rotation;
		const query = [uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z];
		this.socket = io("http://localhost:8020", {query:`user=${JSON.stringify(query)}`});
		const server = this.socket;

		server.on("connect", function(){
			console.info("connected")


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

		});

		server.on("add", function(data){
			console.log("asdf",data)
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
			if(uuid != Users.me.uuid){
				console.info(`adding user ${uuid} ${position} ${rotation}`)
				Users[uuid] = new User(uuid, nickname, position, rotation); 
				dispatchEvent(Users[uuid].add)
			}
		});

		server.on("leave", function(uuid){
			console.info(`deleting user ${uuid} ${position} ${rotation}`)
			//dispatchEvent(Users[uuid].remove)
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
		server.on("chat", function(msg){
			const from = msg[0];
			const content = msg[1];
			console.log(`${from}: ${content}`)
		});
	},
}
function chat(msg){
	Server.socket.emit("chat", msg)
}


window.Users = Users
window.chat = chat
console.log(Users)



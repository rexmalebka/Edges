import {User} from '/js/Users.js';
export const Users = {}
export const Server = {
	init: function(){
		let uuid = Math.random().toString(16).substr(2);
		let nickname = "anon-"+Math.random().toString(16).slice(2,6)
		
		if(!localStorage.getItem("uuid")){
			localStorage.setItem("uuid", uuid)
		}else{
			uuid = localStorage.getItem("uuid")
		}
		
		if(!localStorage.getItem("nickname")){
			localStorage.setItem("nickname", nickname)
		}else{
			nickname = localStorage.getItem("nickname")
		}
		
		if(!Users.me){
			Users.me = new User(uuid, nickname, {x:0, y:0, z:0}, {x:0, y:0, z:0}); 
		}
		
		const position = Users.me.position;
		const rotation = Users.me.rotation;
		const query = [uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z];
//		  myIo = io('https://www.example.com.br:3009', { secure: true, reconnect: true, rejectUnauthorized: false });
		this.socket = io("edges.piranhalab.cc", {path:"/sockets", query:`user=${JSON.stringify(query)}`});
		const server = this.socket;

		server.on("connect", function(){
			console.info("connected")


			Users.me.move = function(){
				const pos = Users.me.position;
				Server.socket.emit("move", [pos.x, pos.y, pos.z])
			};
/*
			Users.me.stop = function(direction){
				Server.socket.emit("stop", direction)
			};
*/
		
			Users.me.rotate = function(){
			    const rot = Users.me.rotation;
			    Server.socket.emit("rotate", [rot.x, rot.y, rot.z])
			};
		
			Users.me.rename = function(nickname){
				console.log("AAAAAAAAA", nickname)
				nickname = nickname.replace( /^(\s\n)+/g, '');
				nickname = nickname.replace(/(\s|\n)+$/,'')
				
				if(nickname.length == 0) return false
				if(nickname == Users.me.nickname) return false
				Server.socket.emit("rename", nickname)
				Users.me.renameUser.detail.oldNickname = Users.me.nickname
				Users.me.renameUser.detail.newNickname = nickname
				dispatchEvent(Users.me.renameUser)
				Users.me.nickname = nickname;
				return true
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
			dispatchEvent(Users[uuid].moveUser);
		});
	    server.on("rotate", function(data){
		console.log("rotandoooooo");
			const uuid = data[0];
			const rotation = {
				x: data[1],
				y: data[2],
				z: data[3]
			};
		    Users[uuid].rotation = rotation;
		    dispatchEvent(Users[uuid].rotateUser);
		});
		server.on("rename", function(data){
			const uuid = data[0];
			const nickname = data[1];
			console.info(`user '${Users[uuid]}' renamed to '${nickname}'`)
			Users[uuid].renameUser.detail.oldNickname = Users[uuid].nickname
			Users[uuid].renameUser.detail.newNickname = nickname
			dispatchEvent(Users[uuid].renameUser)
			Users[uuid].nickname = nickname
		});
		server.on("chat", function(msg){
			const from = msg[0];
			const content = msg[1];
			console.log(`${from}: ${content}`)

			let chatEvent = new CustomEvent('putChat', {
				detail: {
					from: from,
					content: content
				}
			})
			dispatchEvent(chatEvent);
			chatEvent = null
		});
	},
}
export function chat(msg){
	
	msg = msg.replace( /^(\s\n)+/g, '');
	msg = msg.replace(/(\s|\n)+$/,'')

	if(msg.length == 0) return

	Server.socket.emit("chat", msg)
	let chatEvent = new CustomEvent('putChat', {
		detail: {
			from: "me",
			content: msg
		}
	})
	dispatchEvent(chatEvent);
	chatEvent = null
}
function toHex(uuid){
	let a = uuid.split('').map( x => x.charCodeAt())
	console.debug(a)

}

window.Server = Server
window.Users = Users
window.toHex = toHex

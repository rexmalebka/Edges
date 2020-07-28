import {User} from '/js/Users.js';
export const Users = {}
export const Server = {
	init: function(){
		let uuid = Math.random().toString(16).substr(2);
		let nickname = "anon-"+Math.random().toString(16).slice(2,6)
		const texture = "avTex1.jpg"
		
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
			Users.me = new User(uuid, nickname, {x:0, y:0, z:-200}, {x:0, y:0, z:0}, texture); 
		}
		
		const position = Users.me.position;
		const rotation = Users.me.rotation;
		const query = [uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, texture];
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
			const texture = data[8]
			if(uuid != Users.me.uuid){
				console.info(`adding user ${uuid} ${position} ${rotation}`)
				Users[uuid] = new User(uuid, nickname, position, rotation, texture); 
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
		server.on("changeTex", function(msg){
			const uuid = msg[0];
			const name = msg[1];
			console.log(`changing texture ${uuid}: ${name}`)

			let changeTexEvent = new CustomEvent('changeTex', {
				detail: {
					uuid: uuid,
					name: name
				}
			})
			dispatchEvent(changeTexEvent);
			changeTexEvent = null
		});
	},
}

window.Server = Server
window.Users = Users

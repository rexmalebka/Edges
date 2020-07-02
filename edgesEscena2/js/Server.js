const Users = {}
const mimirs = {}
const Server = {
	init: function(){
		let uuid = Math.random().toString(16).substr(2);
		
		if(!localStorage.getItem("uuid")){
			localStorage.setItem("uuid", uuid)
		}else{
			uuid = localStorage.getItem("uuid")
		}
		
		if(!Users.me){
			Users.me = new User(uuid, "---", {x:0, y:10, z:0}, {x:0, y:0, z:0}); 
		}

		const nickname = Users.me.nickname;
		const position = Users.me.position;
		const rotation = Users.me.rotation;
		const query = [uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z];
//		  myIo = io('https://www.example.com.br:3009', { secure: true, reconnect: true, rejectUnauthorized: false });
		this.socket = io("134.122.28.24", {path:"/sockets", query:`user=${JSON.stringify(query)}`});
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
			/*
			Users.me.rotate = function(rotation){
				Users.me.rotation = rotation;    
				Server.socket.emit("rotate", [rotation.x, rotation.y, rotation.z])
			};
			*/
			Users.me.rename = function(name){
				Users.me.nickname = name;
				Server.socket.emit("rename", name)
				dispatchEvent(Users.me.renameUser)
			}

			dispatchEvent(Users.me.add)

			window.addEventListener('move', function(e){
				if(e.detail.uuid == Users.me.uuid){
					console.log("AAAAAAAA moving")
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
function chat(msg){
	
	msg = msg.replace( /^(\s\n)+/g, '');
	msg = msg.replace(/(\s|\n)+$/,'')

	console.debug(`${msg}"`,"**")
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

window.Users = Users
window.chat = chat
console.log(Users)



import {Visuals} from './Visuals.js';
import {Server} from './Server.js';
//
Server.init();
Visuals.init()

window.Server = Server;
//initCanvas();

document.querySelector("#nickname").addEventListener('blur', function(e){
	console.log("changed")
	Users.me.rename(e.target.value)
})


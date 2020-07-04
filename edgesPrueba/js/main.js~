"use strict";
import * as THREE from '/js/three/build/three.module.js';
import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';
import * as flvPlayer from '/js/flv.min.js';
import { Server, Users, chat} from '/js/Server.js';
const personajes = {}
const edges = {
	init: function(){
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
		this.camera.position.y = -400;
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
		this.renderer  = new THREE.WebGLRenderer({ antialias: true })

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		document.querySelector('#distopia').appendChild(this.renderer.domElement)

		this.controls = new PointerLockControls(this.camera, document.body)
		this.scene.background = new THREE.CubeTextureLoader().setPath('/img/').load([
			'px2.png',
			'nx2.png',
			'py2.png',
			'ny2.png',
			'pz2.png',
			'nz2.png'
		]);
		
		
		let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
		light.position.set( 0.5, 1, 0.15 );
		this.scene.add( light );



		this.addFloor();

		this.addCiudad();
		this.addHuachimontones();

		this.addZordon();
		this.addScreen

		this.addLightCiudad();
		this.addLightHuachimontones();

		this.addAudio()
		this.addScreen()

		this.animate();

		window.addEventListener('resize', onWindowResize);
		this.controls.addEventListener('lock', onLock )
		this.controls.addEventListener('unlock', onUnlock )
	}, 
	addFloor: function(){
		let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 400, 400 );
		let wetfloorGeometry = new THREE.PlaneGeometry( 2000, 2000, 200, 200 );
		let pilaresMaterial = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			envMap: this.scene.background,
			refractionRatio: 0.75
		});
		
		floorGeometry.rotateX( - Math.PI / 2 );
		wetfloorGeometry.rotateX( - Math.PI / 2 );
		
		floorGeometry.computeVertexNormals();
		floorGeometry.computeFaceNormals();
		
		
		for (let i = 0; i < floorGeometry.vertices.length; i++) {
			floorGeometry.vertices[i].y += (Math.random()*6)-3;
		}
		
		//var texture = new THREE.TextureLoader().load( 'img/texture.jpg' );

		//texture.wrapS = THREE.RepeatWrapping;
		//texture.wrapT = THREE.RepeatWrapping;
	
		
		var floorTexture = new THREE.TextureLoader().load( 'img/city6.jpg', function ( floorTexture ) {
			floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
			floorTexture.offset.set( 0, 0 );
			floorTexture.repeat.set( 10, 10 );
		});
		
		let floorMaterial = new THREE.MeshStandardMaterial( {
			color: 0xffffff,
			metalness: 0.5,
			roughness: 0.99,
			map: floorTexture,
                        //transparent: true,
                        //opacity: 0.75,
                });
		
		let floor = new THREE.Mesh( floorGeometry, floorMaterial );
		let wetfloor = new THREE.Mesh( wetfloorGeometry, pilaresMaterial); 
		
		
		wetfloor.position.y = -4;   
		floor.position.y = -4;

                this.scene.add( floor );
                this.scene.add (wetfloor);
	},
	addLightHuachimontones: function(){

		this.light1 = new THREE.PointLight(0xa58ea8, 6, 250)
		this.light2 = new THREE.PointLight(0x7d2f74, 6, 250)
		this.light3 = new THREE.PointLight(0x2a315b, 6, 250)
		this.light4 = new THREE.PointLight(0x4484b0, 6, 250)
	
		this.scene.add( this.light1 )
		this.scene.add( this.light2 )
		this.scene.add( this.light3 )
		this.scene.add( this.light4 )

	},
	addLightCiudad: function(){
		this.clight1 = new THREE.PointLight(0xa58ea8, 2, 300)
		this.clight2 = new THREE.PointLight(0x7d2f74, 2, 300)
		this.clight3 = new THREE.PointLight(0x2a315b, 2, 300)
		this.clight4 = new THREE.PointLight(0x4484b0, 2, 300)
		
		this.scene.add( this.clight1 )
		this.scene.add( this.clight2 )
		this.scene.add( this.clight3 )
		this.scene.add( this.clight4 )
	},
	addHuachimontones: function(){
		let pilaresMaterial = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			envMap: this.scene.background,
			refractionRatio: 0.75
		} );
		
		const pilaresGeometry = new THREE.BoxGeometry(20, 20, 20);
		let tam;
		for(let i = 0; i < 100 ; i ++){
			const cube = new THREE.Mesh( pilaresGeometry, pilaresMaterial );
			cube.position.x = Math.random() * 800 - 400;
			//cube[i].position.y = Math.random() * 400 -200;
			cube.position.z = Math.random() * 800 - 900;
			tam = Math.random() * 100;
			cube.scale.x = 0.2;
			cube.scale.y = tam;
			cube.scale.z = 0.2;
			this.scene.add(cube);
		}
	},
	addCiudad: function(){
		let cityLoader = new THREE.TextureLoader();
		
		let cityGeometry = new THREE.BoxGeometry(20, 20, 20);
		
		let cityTexture = cityLoader.load( 'img/after.jpg', function ( cityTexture ) {
			cityTexture.wrapS = cityTexture.wrapT = THREE.RepeatWrapping;
			cityTexture.offset.set( 0, 0 );
			cityTexture.repeat.set( 0.5, 0.5 );
		});
		
		var cityMaterial = new THREE.MeshStandardMaterial( {
			
			color: 0xffffff,
			metalness: 0.9,
			roughness: 0.89,
                        //envmap: scene.background,
                        //side: THREE.DoubleSide,
                        // map: cityTexture,
                        //transparent: true,
                        //opacity: 0.75,
                } );
		let tam;

		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 6; j++){
				var city = new THREE.Mesh( cityGeometry, cityMaterial );
                                //city.wireframe = true;  
				//city.wireframeLinewidth = 2;
				tam = Math.random() * 10;

                                city.position.x = i * 100 - 600;
                                city.position.z = j*100 + 400;
                                city.position.y = tam  + 80 ;
                                city.scale.x = 3;
                                city.scale.y = tam;
                                city.scale.z = 3;
				
				this.scene.add( city);
			}
		}
		
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 6; j++){
				var city = new THREE.Mesh( cityGeometry, cityMaterial);
                                //city.wireframe = true;
                                //city.wireframeLinewidth = 2; 
                                tam = Math.random() * 10; 
                              
                                city.position.x = i * 100+200; 
                                city.position.z = j*100+400;
                                city.position.y = tam  + 80 ; 
                                city.scale.x = 3;
                                city.scale.y = tam;
                                city.scale.z = 3; 
                                
                                this.scene.add( city);
			}
		}


	},
	addZordon: function(){
		this.zordonGeometry = new THREE.CylinderGeometry(150,150,270, 32, 1, true, 0, Math.PI );		
		this.zordonTexture = new THREE.VideoTexture(  document.getElementById( 'streaming-video' ) );
		
		this.zordonMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			//metalness: 0.2,
			//roughness: 0.9,
                        map: this.zordonTexture,
                        side: THREE.DoubleSide,
                        //castShadow: false,
                        //receiveShadow: false
		});
		
		const zordonMesh = new THREE.Mesh(this.zordonGeometry, this.zordonMaterial);
		
		zordonMesh.position.z = 1000;
		zordonMesh.position.y = 270/2;
		zordonMesh.rotation.y = Math.PI/2;
		
		this.scene.add( zordonMesh );
	},
	addAudio: function(){
		let fftSize = 1024;
		const listener = new THREE.AudioListener();
		//camera.add( listener ); // Si es positionalAudio
		
		const audio = new THREE.Audio( listener );

                //var audio = new THREE.PositionalAudio( listener ); // Sustituir por Three.audio

                // audio.setRefDistance( 2 );
                // audio.setDirectionalCone( 180, 230, 0.1 );

                audio.setMediaElementSource(  document.getElementById( 'music' ) );

		let aSourceMaterial = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			envMap: this.scene.background,
			refractionRatio: 0.75
		} );
		
		let aSourceGeometry = new THREE.BoxGeometry(20, 20, 20);
		let aSource = new THREE.Mesh( aSourceGeometry, aSourceMaterial );

                //aSource.add( positionalAudio ); // asociar el audio a una fuente

                this.scene.add(aSource);
                this.analyser = new THREE.AudioAnalyser( audio, fftSize );
		
		
		/////////// 
		
		let audioSphere =  new THREE.SphereGeometry(80, 32, 32);
		let audioSphereOrg =  new THREE.SphereGeometry(80, 32, 32);
		
		
		var audioMaterial = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			metalness: 0.8,
			roughness: 0.1,
                        //envMap: scene.background,
                        // 
                });
            
                let sphere = new THREE.Mesh(audioSphere, this.zordonMaterial);
		sphere.geometry.verticesNeedUpdate = true;
                sphere.geometry.normalsNeedUpdate = true;
                      
                sphere.position.z = -500;
                sphere.position.y = 200; 
                      
                this.scene.add(sphere);
		
		this.sphere = sphere
		this.audioSphere = audioSphere
		this.audioSphereOrg = audioSphereOrg

		
		let cilMaterial = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			envMap: this.scene.background,
			refractionRatio: 0.95
		} );

		let geometryCli, cil1;

		for(let i = 1; i < 14; i++){
			geometryCli = new THREE.CylinderBufferGeometry(200-(i*3), 200-(i*3), 4, 128);
			geometryCli.computeVertexNormals();
			cil1 = new THREE.Mesh( geometryCli, cilMaterial );
			cil1.position.y = i*1.5-6;
			cil1.position.z = -500;
			this.scene.add( cil1 );
		}

	},

	addScreen: function(){
		let screensGeometry = new THREE.BoxGeometry( 60, 200, 60 );
		let screen;
		for(let i = 0; i < 3; i++){		
			screen = new THREE.Mesh(screensGeometry, this.zordonMaterial);
			screen.position.z = 280;
			screen.position.x = i * 200 + 200;
                        screen.position.y = 100;

                        this.scene.add(screen);
		}


                for(var i = 0; i < 3; i++){
			screen = new THREE.Mesh(screensGeometry, this.zordonMaterial);
                        screen.position.z = 280;
                        screen.position.x = i * 200 - 600;
                        screen.position.y = 100;
                        this.scene.add(screen);
		}

	},
	moveAudioSphere: function(){
		let data = edges.analyser.getFrequencyData();
		edges.sphere.geometry.verticesNeedUpdate = true;  // Necessary to update
		
		for (let i = 0, len = edges.audioSphere.vertices.length; i < len; i++) {
			//audioSphere.vertices[i].y = audioSphereOrg.vertices[i].y;
                        edges.audioSphere.vertices[i].y = edges.audioSphereOrg.vertices[i].y * (1+data[i%128] / 128) ;
                        edges.audioSphere.vertices[i].x = edges.audioSphereOrg.vertices[i].x * (1+data[i%128] / 128);
                        edges.audioSphere.vertices[i].z = edges.audioSphereOrg.vertices[i].z * (1+data[i%128] / 128);
		}

	},
	moveLight: function(){
		var time = Date.now() * 0.0005;
		
		edges.light1.position.x = Math.sin( time * 0.7 ) * 260;
		edges.light1.position.y = 150 +Math.cos( time * 0.5 ) * 80+10;
		edges.light1.position.z = Math.cos( time * 0.3 ) * 60 -500;
	
		edges.light2.position.x = Math.cos( time * 0.3 ) * 260;
		edges.light2.position.y = 150+Math.sin( time * 0.5 ) * 80 + 10;
		edges.light2.position.z = Math.sin( time * 0.7 ) * 60 -500;

		edges.light3.position.x = Math.sin( time * 0.7 ) * 230;
		edges.light3.position.y = 150+Math.cos( time * 0.3 ) * 40 + 10;
		edges.light3.position.z = Math.sin( time * 0.5 ) * 30 -500;

		edges.light4.position.x = Math.sin( time * 0.3 ) * 230;
		edges.light4.position.y = 150+Math.cos( time * 0.7 ) * 40 + 10;
		edges.light4.position.z = Math.sin( time * 0.5 ) * 30 -500;

                // City lights
		
		
		edges.clight1.position.x = Math.sin( time * 0.7 ) * 260;
		edges.clight1.position.y = 100 +Math.cos( time * 0.5 ) * 80+10;
		edges.clight1.position.z = Math.cos( time * 0.3 ) * 260 +800;

                edges.clight2.position.x = Math.cos( time * 0.3 ) * 260;
                edges.clight2.position.y = 100+Math.sin( time * 0.5 ) * 80 + 10;
		edges.clight2.position.z = Math.sin( time * 0.7 ) * 260 +800;

		edges.clight3.position.x = Math.sin( time * 0.7 ) * 230;
		edges.clight3.position.y = 100+Math.cos( time * 0.3 ) * 40 + 10;
		edges.clight3.position.z = Math.sin( time * 0.5 ) * 230 +800;

		edges.clight4.position.x = Math.sin( time * 0.3 ) * 230;
		edges.clight4.position.y = 100+Math.cos( time * 0.7 ) * 40 + 10;
		edges.clight4.position.z = Math.sin( time * 0.5 ) * 230 +800;
	},
	move: function(){
		const delta = 0.015
		
		edges.velocity.x -= edges.velocity.x * 10.0 * delta
		edges.velocity.z -= edges.velocity.z * 10.0 * delta
		edges.velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass
		
		edges.direction.z = Number(edges.moveForward) - Number(edges.moveBackward)
		edges.direction.x = Number(edges.moveRight) - Number(edges.moveLeft)
	
		edges.direction.normalize()
		
		if (edges.moveForward || edges.moveBackward || edges.moveLeft || edges.moveRight) {
			const camPos = edges.camera.position
			Users.me.position.x = camPos.x
			Users.me.position.y = camPos.y
			Users.me.position.z = camPos.z
			
			personajes.me.position.x = camPos.x
			personajes.me.position.y = camPos.y
			personajes.me.position.z = camPos.z
			if(!edges.moving){
				edges.stoping = false
				edges.moving = setInterval(function(){
					Users.me.move();
				},400)
			}
		}else{
			clearInterval(edges.moving)
			if(!edges.stoping && edges.moving){
				edges.stoping = true
				Users.me.move()
			}
			edges.moving = false
		
		}
		if (edges.moveForward || edges.moveBackward) {
			edges.velocity.z -= edges.direction.z * 400.0 * delta
		}
		if (edges.moveLeft || edges.moveRight) {
			edges.velocity.x -= edges.direction.x * 400.0 * delta
		}
		edges.controls.moveRight(-edges.velocity.x * delta)
		edges.controls.moveForward(-edges.velocity.z * delta)

	},
	animate: function(){
		requestAnimationFrame( edges.animate );
		edges.renderer.render(edges.scene, edges.camera);
		edges.moveAudioSphere();
		edges.moveLight();
		if(edges.controls.isLocked) edges.move()
	},
	velocity: new THREE.Vector3(),
	direction: new THREE.Vector3(),
	moveForward: false,
	moveBackward: false,
	moveLeft: false,
	moveRight: false,
	canJumpt: false,
	moving: false,
	stoping: false,
};

let ctrl = false

function onKeyDown(event) {
	switch (event.keyCode) {
		case 38: // up
		case 87: // w
			edges.moveForward = true
			break
			
		case 37: // left
		case 65: // a
			edges.moveLeft = true
			break
			
		case 40: // down
		case 83: // s
			edges.moveBackward = true
			break
		case 39: // right
		case 68: // d
			edges.moveRight = true
			break	
		case 32: // space
			if (edges.canJump === true) // velocity.y += 350
			{ edges.canJump = false }
			break
		case 17:
			ctrl = true;
		case 13:
			// chat
			if(!ctrl) {
				mandarMensaje(event)
			}else{
				inputMensaje.innerText += '\n'
				
				let range,selection;
				range = document.createRange();//Create a range (a range is a like the selection but invisible)
				range.selectNodeContents(inputMensaje);//Select the entire contents of the element with the range
				range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
				selection = window.getSelection();//get the selection object (allows you to change selection)
				selection.removeAllRanges();//remove any selections already made
				selection.addRange(range);//make the range you have just created the visible selection
			}
			

	}
}


function onKeyUp (event) {
	switch (event.keyCode) {
		case 38: // up
		case 87: // w
			edges.moveForward = false
			break
		case 37: // left
		case 65: // a
			edges.moveLeft = false
			break
			
		case 40: // down
		case 83: // s
			edges.moveBackward = false
			break
			
		case 39: // right
		case 68: // d
			edges.moveRight = false
			break
		case 84:
			// t
			inputMensaje.focus()
		case 17:
			ctrl = false;
	}
}

function onWindowResize() {
	edges.camera.aspect = window.innerWidth / window.innerHeight
	edges.camera.updateProjectionMatrix()
	edges.renderer.setSize(window.innerWidth, window.innerHeight)
}

function onLoadMedia(){
	document.querySelector('#music').play();
	if(flvjs.isSupported()){
		let flvPlayer = flvjs.createPlayer({
			type: "flv",
			isLive: true,
			url: 'http://134.122.125.230/live?port=1935&app=testing&stream=hola'
		});
		flvPlayer.attachMediaElement(document.querySelector('#streaming-video'))
		flvPlayer.load();
		flvPlayer.play();
		flvPlayer.on('error',function(err){
			if(err==="NetworkError"){
				flvPlayer.unload()
				flvPlayer.load()
				flvPlayer.play();
			}
		});

	}
}

function onLock(){
	document.querySelector("#instructions").style.display = "none";
	document.querySelector("#blocker").style.display = "none";
	if(onLoadMedia){
		onLoadMedia()
		onLoadMedia = null
	}
}

function onUnlock(){
	document.querySelector("#instructions").style.display = "block";
	document.querySelector("#blocker").style.display = "";
}

function putChat(){
	const from = Users[event.detail.from].nickname
	const content = event.detail.content
	
	console.debug(content, '<-')
	const mensaje = document.createElement('div')
	mensaje.classList.add('mensaje')

	
	const nombre = document.createElement('span')
	nombre.classList.add('nombre')
	nombre.textContent = from

	
	const contenido = document.createElement('span')
	contenido.classList.add('contenido')
	contenido.textContent = content

	
	mensaje.appendChild(nombre)
	mensaje.appendChild(contenido)

	
	document.querySelector('#mensajes').appendChild(mensaje)
}

function moveUser(event) {
	const uuid = event.detail.uuid
	const newPos = {
		x: Users[uuid].position.x,
		y: Users[uuid].position.y,
		z: Users[uuid].position.z
	}
	const oldPos = {
		x: personajes[uuid].position.x,
		y: personajes[uuid].position.y,
		z: personajes[uuid].position.z
	}

	const dx = newPos.x - oldPos.x
	const dy = newPos.y - oldPos.y
	const dz = newPos.z - oldPos.z

	const mi = 20
	let i = 1

	
	function interpolate (i) {
		personajes[uuid].position.x = oldPos.x + (dx * i / mi) 
    personajes[uuid].position.y = oldPos.y + (dy * i / mi) 
    personajes[uuid].position.z = oldPos.z + (dz * i / mi) 
  }
  const intfunc = setInterval(function () {
    i++
    interpolate(i)
    if (i == (mi - 1)) {
      personajes[uuid].position.x = newPos.x
      personajes[uuid].position.y = newPos.y
      personajes[uuid].position.z = newPos.z
      clearInterval(intfunc)
    }
  }, 10)
}

function removeUser(event) {
	const uuid = event.detail.uuid
	personajes[uuid].geometry.dispose()
	personajes[uuid].material.dispose()
	scene.remove(personajes[uuid])
	renderer.renderLists.dispose()
	delete personajes[uuid]
}

function addUser(event) {
	let uuid
	if (event.detail.uuid === Users.me.uuid) {
		uuid = 'me'
	} else {
		uuid = event.detail.uuid
	}
  
        const position = Users[uuid].position
	
	const geom = new THREE.SphereBufferGeometry(5, 32, 32)
	const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 })
	const mimir = new THREE.Mesh(geom, mat)
	
	mimir.position.x = position.x
	mimir.position.y = position.y
	mimir.position.z = position.z
  
       /* 
	// model
	console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
	var loader = new THREE.FBXLoader();
	loader.load( '/models/fbx/monito.fbx', function ( object ) {
                personajes[uuid] = object
                console.log("UWU")

        });
	*/
	edges.scene.add( mimir );
	personajes[uuid] = mimir

}

function cambiarNombre(e) {
	if (document.querySelector("#usuarix").value.length > 0) {
		document.querySelector("#cambiarNombre").disabled = false
	} else {
		document.querySelector("#cambiarNombre").disabled = true
	}
}



function cambiarNombrebutton (e) {
	e.preventDefault()
	Users.me.rename(document.querySelector("#usuarix").value)
	document.querySelector("#mostrarUsuarix").textContent = document.querySelector("#usuarix").value
}


function mandarMensaje(e) {
	e.preventDefault()
	const text = inputMensaje.textContent
	chat(inputMensaje.innerText)
	inputMensaje.textContent = ''
}

document.querySelector("#mostrarChat").addEventListener('click', function (e) {
	e.preventDefault()
	document.querySelector("#chat").style.display = document.querySelector("#chat").style.display == 'none' ? '' : 'none'
})

inputMensaje.addEventListener('input', function (e) {
  if (inputMensaje.textContent.length > 248) {
    inputMensaje.textContent = inputMensaje.textContent.slice(0, 248)
  }
})

document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)

document.querySelector('#usuarix').addEventListener('change', cambiarNombre)
document.querySelector('#usuarix').addEventListener('keydown', cambiarNombre)
document.querySelector("#instructions").addEventListener('click', ()=> edges.controls.lock())
document.querySelector('#cambiarNombre').addEventListener('click', cambiarNombrebutton)
document.querySelector('#mandarMensaje').addEventListener('click', mandarMensaje)

window.addEventListener('addUser', addUser)
window.addEventListener('removeUser', removeUser)
window.addEventListener('moveUser', moveUser)
window.addEventListener('putChat', putChat)


edges.init();
Server.init();

document.querySelector('#usuarix').value = Users.me.nickname
document.querySelector("#mostrarUsuarix").textContent = document.querySelector("#usuarix").value

window.edges = edges;
window.flvPlayer = flvPlayer;
window.personajes = personajes;

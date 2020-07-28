"use strict";
import * as THREE from '/js/three/build/three.module.js';
import { GLTFLoader } from '/js/three/examples/jsm/loaders/GLTFLoader.js';
import { controls } from '/js/Controls.js';
import { controls as controls_mb } from '/js/Controls_mobile.js';
import * as flvPlayer from '/js/flv.min.js';
import { Server, Users } from '/js/Server.js';
import { Chat } from '/js/chat.js';
import { raycaster } from '/js/Collisions.js';

const personajes = {}

const edges = {
	init: function(){
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500)
		this.camera.position.z = 400;
		this.renderer  = new THREE.WebGLRenderer({ antialias: true })

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.raycaster = raycaster.init(this.camera, this.scene)

		if(detectMob()){
			this.controls = controls_mb.init(this.camera)		//PointerLockControls(this.camera, document.body)
		}else{
			this.controls = controls.init(this.camera)		//PointerLockControls(this.camera, document.body)
		}
		document.querySelector('#distopia').appendChild(this.renderer.domElement)

				
		//let light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.05 );
		let hemislight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.8 );
		this.scene.add(hemislight)
		this.hemislight = hemislight
		var light = new THREE.SpotLight( 0xff00aa );
		this.light = light
		light.position.set( 0, 30, -200 );

	        light.shadow.mapSize.width = 2048*4;  // default
                light.shadow.mapSize.height = 2048*4; // default
                light.shadow.camera.near = 0.5;       // default
                light.shadow.camera.far = 500      // default

                light.intensity = 0.5 
                light.position.y = 100 
                light.penumbra = 1 
                light.decay = 2 


		this.scene.add( light );

		this.addFloor();
		this.addCueva();
		this.addEstalac();
		this.addRocas();
		this.addRings();
		this.mkAvatar(); 
	
		this.animate();

		window.addEventListener('resize', onWindowResize);
	}, 
	addFloor: function(){
		let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 400, 400 );
		floorGeometry.rotateX( - Math.PI / 2 );
		
		floorGeometry.computeVertexNormals();
		floorGeometry.computeFaceNormals();
		
		console.log(floorGeometry.vertices.length,'aaaa')
		
		for (let i = 0; i < floorGeometry.vertices.length; i++) {
			floorGeometry.vertices[i].y += (Math.random()*2) - 3
		}
		
		var texture = new THREE.TextureLoader().load( "/img/rockFloor.png" );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 4, 4 );

		let floorMaterial = new THREE.MeshStandardMaterial( {
			map: texture
                });
		
		let floor = new THREE.Mesh( floorGeometry, floorMaterial );
		floor.castShadow = true; //default is false
		floor.receiveShadow = true; //default
		this.floor = floor
                this.scene.add (floor);
	},
	addCueva: function(){
		// points - (x, y) pairs are rotated around the y-axis
		let points = [];
		for ( var deg = 0; deg <= 180; deg += 20 ) {
			var rad = Math.PI * deg / 180;
			var point = new THREE.Vector2( ( 0.72 + .08 * Math.cos( rad ) ) * Math.sin( rad ), - Math.cos( rad ) ); // the "egg equation"
			//console.log( point ); // x-coord should be greater than zero to avoid degenerate triangles; it is not in this formula.
			points.push( point );
		}
	    
		let texture = new THREE.VideoTexture(document.querySelector('#streaming-video'));
		
		let geom = new THREE.LatheBufferGeometry( points, 32 );
		let mat = new THREE.MeshStandardMaterial( { color: 0xffffff, map: texture, side: THREE.DoubleSide } );

		let egg = new THREE.Mesh(geom, mat)

		egg.name = 'egg'

		egg.position.z = -200
		egg.scale.multiplyScalar(850)
		this.egg = egg
		this.scene.add(egg)
	},
	addEstalac: function(){
		let loader = new GLTFLoader();
		loader.load(
			// resource URL
			'/models/stalac1.glb',
			// called when the resource is loaded
			function ( gltf ) {
				let mat = new THREE.MeshStandardMaterial( { color: 0xdba9ce, transparent: true, opacity: 0.7 } );
				mat.castShadow = true
				gltf.scene.children[0].material = mat

				let f,g;
				for(let k=0;k<15;k++){

					let stalactita = gltf.scene.clone()
					stalactita.scale.y = Math.random() * 7 + 1
					stalactita.scale.z = Math.random() * 6 + 1
					stalactita.scale.x = stalactita.scale.z
					stalactita.rotation.x += Math.random()/2-0.25
					stalactita.rotation.z += Math.random()/2-0.25
					f = 400 * Math.sin(k) + Math.abs(200* Math.sin(10*k)) - 100
					g = 400 * Math.sin(k) + Math.abs(200* Math.sin((k/4)**2)) - 100
					//g = 200 * Math.cos(k) + k
					stalactita.position.set(f,0,g)

					edges.scene.add( stalactita );
				}
			})

	},
	addRings: function(){
		let mat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		mat.transparent = true
		mat.opacity = 0.4
		let rings = []
		for (let k=0;k<10; k++){
			let geom = new THREE.TorusGeometry( 590 - 50*k, 0.5, 16, 100 );
			let ring = new THREE.Mesh( geom, mat );
			ring.rotateX(Math.PI/2 + k*0.1)
			ring.position.set(0,30 + k * 80,-200)
			rings.push(ring)
			this.scene.add(ring)
		}
		this.rings = rings
	},

	addLamparitas: function(){

	},
	addRocas: function(){
		let loader = new GLTFLoader();
		loader.load(
			// resource URL
			'/models/rock1.glb',
			// called when the resource is loaded
			function ( gltf ) {
				//let mat = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
				let mat = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide, map: edges.floor.material.map } );
				mat.castShadow = true
				gltf.scene.children[0].material = mat

				let roca = gltf.scene
				roca.scale.multiplyScalar(30)

				roca.rotateY(Math.PI)

				roca.position.y = 3
				roca.position.z = 300
				edges.scene.add(roca)
				edges.roca = roca
			})
		loader.load(
			// resource URL
			'/models/rock2.glb',
			// called when the resource is loaded
			function ( gltf ) {
				let mat = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide, map: edges.floor.material.map } );
				mat.castShadow = true
				gltf.scene.children[0].material = mat

				let roca = gltf.scene
				roca.scale.multiplyScalar(40)

				roca.rotateX(0.1)
				roca.rotateY(Math.PI)

				roca.position.y = 3
				roca.position.x = 200
				roca.position.z = -300
				edges.scene.add(roca)
				edges.roca2 = roca
			})
		loader.load(
			// resource URL
			'/models/rock3.glb',
			// called when the resource is loaded
			function ( gltf ) {
				let mat = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide, map: edges.floor.material.map } );
				mat.castShadow = true
				gltf.scene.children[0].material = mat

				let roca = gltf.scene
				roca.scale.multiplyScalar(10)

				roca.rotateY(Math.PI)

				roca.position.y = 0
				roca.position.x = 10
				roca.position.z = -50
				edges.scene.add(roca)
			})
		loader.load(
			// resource URL
			'/models/rock4.glb',
			// called when the resource is loaded
			function ( gltf ) {
				let mat = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide, map: edges.floor.material.map } );
				mat.castShadow = true
				gltf.scene.children[0].material = mat

				let roca = gltf.scene
				roca.scale.multiplyScalar(30)

				roca.rotateY(Math.PI)

				roca.position.y = 3
				roca.position.x = 300
				roca.position.z = -100
				edges.scene.add(roca)
				edges.roca3 = roca
			})
	
	},
    mkAvatar: function(){

	let group = new THREE.Group();
	this.avatar = new THREE.Group();	
	
            var texture1 = new THREE.TextureLoader().load( 'img/avTex1.jpg', function ( floorTexture ) {                floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.offset.set( 0.6, 0.6 );
                floorTexture.repeat.set( 1, 1 );
            });
     
     
            var texture2 = new THREE.TextureLoader().load( 'img/avTex2.jpg', function ( floorTexture ) {
                floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.offset.set( 0.6, 0.6 );
                floorTexture.repeat.set( 1, 1 );
            });
     
     
            var texture3 = new THREE.TextureLoader().load( 'img/avTex3.jpg', function ( floorTexture ) {
            floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.offset.set( 0.6, 0.6 );
                floorTexture.repeat.set( 1, 1 );
            });
     
     
            var texture4 = new THREE.TextureLoader().load( 'img/avTex4.jpg', function ( floorTexture ) {
                floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.offset.set( 0.6, 0.6 );
                floorTexture.repeat.set( 1, 1 );
        });

     
        this.texturas = {"avTex1.jpg": texture1, "avTex2.jpg": texture2, "avTex3.jpg": texture3, "avTex4.jpg": texture4}
	
	let avbodyMaterial = new THREE.MeshBasicMaterial( {
	    color: 0xffffff,
	    //metalness: 0.9,
	    //roughness: 0.8,
	    map: texture1,
            //transparent: true,
            //opacity: 0.75,
        });
	
	
	var avbodyGeometry = new THREE.CylinderGeometry( 1.5, 0.5, 6, 32 );
	//var avbodyMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	var avbodyMesh = new THREE.Mesh(avbodyGeometry, avbodyMaterial);  

	avbodyMesh.position.y = 4;
	group.add(avbodyMesh);


	var avheadMaterial = new THREE.MeshStandardMaterial({
	    color: 0xffffff,
	    metalness: 0.8,
	    roughness: 0.5,
            //envMap: scene.background,
            // 
        });
          
	
	var avheadGeometry = new THREE.SphereGeometry( 1.75, 10, 10 );
	//var avheadMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	var avheadSphere = new THREE.Mesh( avheadGeometry, avbodyMaterial );

	avheadSphere.position.y = 10;
	group.add(avheadSphere); 


	var aveyeGeometry = new THREE.SphereGeometry( 0.7, 10, 10 );
	var aveyeMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	var aveyeSphere = new THREE.Mesh( aveyeGeometry, aveyeMaterial );

	aveyeSphere.position.y = 10;
	aveyeSphere.position.z = 1.7;

	aveyeSphere.scale.y = 0.5;
	aveyeSphere.scale.z = 0.25; 

	group.add(aveyeSphere);
	
	var aveye2Geometry = new THREE.SphereGeometry( 0.2, 10, 10 );
	var aveye2Material = new THREE.MeshBasicMaterial( {color: 0x00000} );
	var aveye2Sphere = new THREE.Mesh( aveye2Geometry, aveye2Material );

	aveye2Sphere.position.y = 10;
	aveye2Sphere.position.z = 1.9;

	//aveyeSphere.scale.y = 0.5;
	aveye2Sphere.scale.z = 0.25; 

	group.add(aveye2Sphere); 

	//edges.scene.add(group); 
	this.avatar = group.clone(); 
	
    },
 
    
    addVideo: function(){

	for(var i = 1; i < 10; i++){

	    var video = document.getElementById( 'video'+i );
	    video.play();
	    video.addEventListener('play', function() {
		this.currentTime = 3;
	    }, false);
	
	    let texture = new THREE.VideoTexture( video );
	    
	    let videoGeometry = new THREE.PlaneGeometry(60, 60, 4);
	    let videoMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, side: THREE.DoubleSide } );
	    
	    let videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

	    videoMesh.position.x = 80*i-400; 	    
	    videoMesh.position.z = 100; 
	    videoMesh.position.y = 30; 
	    
	    edges.scene.add(videoMesh);


        var zgamuTex = new THREE.TextureLoader().load( 'img/zgamu.png', function ( zgamuTexture ) {

        });
     
        let zgamuGeometry = new THREE.PlaneGeometry(60, 60, 4);
        let zgamuMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, map: zgamuTex, side: THREE.DoubleSide, transparent: true, overdraw: true } ); 
     
        let zgamuMesh = new THREE.Mesh(zgamuGeometry, zgamuMaterial);

        zgamuMesh.position.x = 400; 
        zgamuMesh.position.z = 100; 
        zgamuMesh.position.y = 30;  
     
        edges.scene.add(zgamuMesh); 



     var martaTex = new THREE.TextureLoader().load( 'img/lv.png', function ( martaTexture ) {

        });

        let martaGeometry = new THREE.PlaneGeometry(60, 60, 4);
        let martaMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, map: martaTex, side: THREE.DoubleSide, transparent: true, overdraw: true } );

        let martaMesh = new THREE.Mesh(martaGeometry, martaMaterial);

        martaMesh.position.x = -400;
        martaMesh.position.z = 100;
        martaMesh.position.y = 30;

        edges.scene.add(martaMesh);



	    
	}
	    
	
	    
	

	

    },
    

	addScreen: function(){

	    let screensGeometry = new THREE.PlaneGeometry( 100, 50, 8 );

	    let screen;
	    
		for(let i = 0; i < 3; i++){		
		    screen = new THREE.Mesh(screensGeometry, this.zordonMaterial);
		    
		    screen.position.z = 200 + ((i+1)*200);
		    screen.position.x = 150;
		    screen.position.y = 25;
		    
		    screen.rotation.y = -Math.PI /2; 
		    
                    this.scene.add(screen);
		}


                for(var i = 0; i < 3; i++){
		    screen = new THREE.Mesh(screensGeometry, this.zordonMaterial);

		    screen.position.z = 200 + ((i+1)*200);
		    screen.position.x = -150;
		    screen.position.y = 25;
		    
		    screen.rotation.y = Math.PI /2; 

		    this.scene.add(screen);
		}

	},
	animate: function(){
		requestAnimationFrame( edges.animate );
		edges.renderer.render(edges.scene, edges.camera);
		if (edges.streamingAudio) edges.moveAudioSphere()
		//edges.moveLight();
		//edges.moveSat(); 
	//	if(edges.controls.controls.isLocked) edges.controls.move()
	},
	streamingAudio: false
};


function onWindowResize() {
	edges.camera.aspect = window.innerWidth / window.innerHeight
	edges.camera.updateProjectionMatrix()
	edges.renderer.setSize(window.innerWidth, window.innerHeight)
}

function onLoadMedia(){

	let audio = new Audio('http://edges.piranhalab.cc/audio');
	audio.crossOrigin = "anonymous";

	window.audio=audio
	let playPromise = audio.play()
	if (playPromise !== undefined) {
		playPromise.then(aaa => {
			// Automatic playback started!
			// Show playing UI.
			if(!edges.streamingAudio){
				edges.addAudio(audio)
				edges.streamingAudio= true
			}
		}).catch(error => {
			// Auto-play was prevented
			// // Show paused UI.
		});
	}

	if(flvjs.isSupported()){
		let flvPlayer = flvjs.createPlayer({
			type: "flv",
			isLive: true,
			url: 'http://edges.piranhalab.cc/live'
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
	}else{
		console.debug("flv js not supported :( ")
	}
}
function putChat(){
	const from = Users[event.detail.from].nickname
	const content = event.detail.content
	
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
	if(!personajes[uuid]) return
	const newPos = {
		x: Users[uuid].position.x,
	    y: 0,// Users[uuid].position.y,
		z: Users[uuid].position.z
	}
	const oldPos = {
		x: personajes[uuid].position.x,
	    y: 0,//personajes[uuid].position.y,
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

function rotateUser(event) {
	const uuid = event.detail.uuid
	const newPos = {
	    x: Users[uuid].rotation.x,
	    y: Users[uuid].rotation.y,
	    z: Users[uuid].rotation.z
	}
	const oldPos = {
	    x: personajes[uuid].rotation.x,
	    y: personajes[uuid].rotation.y,
	    z: personajes[uuid].rotation.z
	}

	const dx = newPos.x - oldPos.x
	const dy = newPos.y - oldPos.y
	const dz = newPos.z - oldPos.z

	const mi = 20
	let i = 1

	
	function interpolate (i) {
	    personajes[uuid].rotation.x = oldPos.x + (dx * i / mi) 
	    personajes[uuid].rotation.y = oldPos.y + (dy * i / mi) 
	    personajes[uuid].rotation.z = oldPos.z + (dz * i / mi) 
  }
  const intfunc = setInterval(function () {
    i++
    interpolate(i)
    if (i == (mi - 1)) {
      personajes[uuid].rotation.x = newPos.x
      personajes[uuid].rotation.y = newPos.y
      personajes[uuid].rotation.z = newPos.z
      clearInterval(intfunc)
    }
  }, 10)
}

function removeUser(event) {
    const uuid = event.detail.uuid

    personajes[uuid].remove(personajes[uuid].children[0]);
    personajes[uuid].remove(personajes[uuid].children[1]); 
    personajes[uuid].remove(personajes[uuid].children[2]); 
    personajes[uuid].remove(personajes[uuid].children[3]); 
    personajes[uuid].remove(personajes[uuid].children[4]); 
     
    edges.scene.remove(personajes[uuid])

    //personajes[uuid].geometry.dispose()
    //personajes[uuid].material.dispose()
    //	edges.scene.remove(personajes[uuid])

    edges.renderer.renderLists.dispose()

	delete personajes[uuid]
	document.querySelector("#numUsuarios").textContent = Object.keys(personajes).length
}

function addUser(event) {
	let uuid
	if (event.detail.uuid === Users.me.uuid) {
		uuid = 'me'
	} else {
		uuid = event.detail.uuid
	}
  
	console.log("adding user:", uuid)
        const position = Users[uuid].position

    //edges.avatar.position.x = position.x;
    //edges.avatar.position.y = position.y;
    //edges.avatar.position.z = position.z;

    //var text; 
    var loader2 = new THREE.FontLoader();

    loader2.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	let monito = edges.avatar.clone();

        var matDark = new THREE.LineBasicMaterial( {
            color: 0xffffff,
            side: THREE.DoubleSide,
	    transparent: true,
	    opacity: 0.5
        } );
	
	
        var message = Users[uuid].nickname;
	
        var shapes = font.generateShapes( message, 2 );
	
        var geometry = new THREE.ShapeBufferGeometry( shapes );
	
        geometry.computeBoundingBox();
	
        var xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x);
	
        geometry.translate( xMid, 0, 0 );
	
        var text = new THREE.Mesh( geometry, matDark );
	
	
        text.position.x = 0;
        text.position.y = position.y+20;
        text.position.z = 0;

	text.nick_ = true; 
	    monito.persona = true
        monito.add( text );


	edges.scene.add( monito );
	personajes[uuid] = monito;

    	
    });

    if(uuid == 'me'){
	edges.camera.position.x = position.x
	edges.camera.position.y = 14
	edges.camera.position.z = position.z
     edges.camera.rotation.y = Math.PI
    }
    
    document.querySelector("#numUsuarios").textContent = Object.keys(Users).length

    //edges.scene.add( mimir );
    // personajes[uuid] = mimir
    
}

function renameUser(event){

    let uuid
    if (event.detail.uuid === Users.me.uuid) {
	uuid = 'me'
    } else {
	uuid = event.detail.uuid
    }
    
    console.log("renaming user:", uuid)
    const position = personajes[uuid].position

    let nickmesh = personajes[uuid].children.filter(x => x.nick_)[0];

    personajes[uuid].remove(nickmesh);
    
    /*
	const geom = new THREE.SphereBufferGeometry(5, 32, 32)
	const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 })
	const mimir = new THREE.Mesh(geom, mat)
	
	mimir.position.x = position.x
	mimir.position.y = position.y
    mimir.position.z = position.z

    */
    
    //edges.avatar.position.x = position.x;
    //edges.avatar.position.y = position.y;
    //edges.avatar.position.z = position.z;


    //var text; 
    var loader2 = new THREE.FontLoader();

    loader2.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
	
	
        var matDark = new THREE.LineBasicMaterial( {
            color: 0xffffff,
            side: THREE.DoubleSide,
	    transparent: true,
	    opacity: 0.5
        } );
	
        var message = Users[uuid].nickname;
	
        var shapes = font.generateShapes( message, 2 );
	
        var geometry = new THREE.ShapeBufferGeometry( shapes );
	
        geometry.computeBoundingBox();
	
        var xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x);
	
        geometry.translate( xMid, 0, 0 );
	
        var text = new THREE.Mesh( geometry, matDark );
	
        text.position.x = 0;
        text.position.y = position.y+20;
        text.position.z = 0;
    
	personajes[uuid].add(text);
    	
    });

    if(uuid == 'me'){
	edges.camera.position.x = position.x
	edges.camera.position.y = 14
	edges.camera.position.z = position.z
    }

    
	let oldNickname = event.detail.oldNickname
	let newNickname = event.detail.newNickname
	let content = `Usuarix "${oldNickname}" se llama ahora "${newNickname}"`
	const mensaje = document.createElement('div')
	mensaje.classList.add('mensaje')
	
	const contenido = document.createElement('span')
	contenido.classList.add('log')
	contenido.textContent = content
	
	mensaje.appendChild(contenido)
	
    document.querySelector('#mensajes').appendChild(mensaje)

    personajes[uuid].remove(personajes[uuid].children[4]); 

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
	if(Users.me.rename(document.querySelector("#usuarix").value)) 	document.querySelector("#mostrarUsuarix").textContent = document.querySelector("#usuarix").value
}


function mandarMensaje(e) {
	e.preventDefault()
	const text = inputMensaje.textContent
	chat(inputMensaje.innerText)
	inputMensaje.textContent = ''
}

function mostrarChat(e) {
	e.preventDefault()
	document.querySelector("#chat").style.display = document.querySelector("#chat").style.display == 'none' ? '' : 'none'
}

function selTex(e) {
    e.preventDefault()
    document.querySelector("#textura2").style.display = document.querySelector("#textura2").style.display == 'none' ? '' : 'none'
    document.querySelector("#textura3").style.display = document.querySelector("#textura3").style.display == 'none' ? '' : 'none'
    document.querySelector("#textura4").style.display = document.querySelector("#textura4").style.display == 'none' ? '' : 'none'
  
}

function changeTex(e) {
    e.preventDefault()
    var c = document.querySelector("#textura1").src
    var l = e.target.src.split('/')

    document.querySelector("#textura1").src  = e.target.src
    e.target.src = c
    // console.log(c)

    // Cambiar textura del mono en cuestión
    // personajes.me.algo que es la textura
    let mat0 = personajes.me.children[0].material.clone()
    mat0.map = edges.texturas[l[ l.length -1 ]]
    personajes.me.children[0].material = mat0
    personajes.me.children[1].material = mat0

    Server.socket.emit('changeTex', l[l.length-1]);
  
}

function changeTexUser(e) {
	let uuid = e.detail.uuid;
	let name = e.detail.name;
	if(!edges.texturas[name]) return
    let mat0 = personajes[uuid].children[0].material.clone()
    mat0.map = edges.texturas[name]
    personajes[uuid].children[0].material = mat0
    personajes[uuid].children[1].material = mat0
}

inputMensaje.addEventListener('input', function (e) {
  if (inputMensaje.textContent.length > 248) {
    inputMensaje.textContent = inputMensaje.textContent.slice(0, 248)
  }
})

//document.addEventListener('keydown', onKeyDown, false)
//document.addEventListener('keyup', onKeyUp, false)

document.querySelector('#usuarix').addEventListener('change', cambiarNombre)
document.querySelector('#usuarix').addEventListener('keydown', cambiarNombre)
//document.querySelector("#instructions").addEventListener('click', ()=> edges.controls.controls.lock())
document.querySelector('#cambiarNombre').addEventListener('click', cambiarNombrebutton)


document.querySelector("#textura1").addEventListener('click', selTex)

document.querySelector("#textura2").addEventListener('click', changeTex)
document.querySelector("#textura3").addEventListener('click', changeTex)
document.querySelector("#textura4").addEventListener('click', changeTex)


window.addEventListener('addUser', addUser)
window.addEventListener('removeUser', removeUser)
window.addEventListener('moveUser', moveUser)
window.addEventListener('rotateUser', rotateUser)
window.addEventListener('renameUser', renameUser)
window.addEventListener('changeTex', changeTexUser)
/*
window.addEventListener('blur', function(e){
	if(!edges.controls.controls.isLocked) return
	document.querySelector("#chat").style.display = 'none'
	document.querySelector("#instructions").style.display = "block";
	document.querySelector("#blocker").style.display = "";
})
*/
edges.init();
Chat.init()
Server.init();

document.querySelector('#usuarix').value = Users.me.nickname
document.querySelector("#mostrarUsuarix").textContent = document.querySelector("#usuarix").value
/*
document.addEventListener("click",function(){
	if(edges.controls.controls.isLocked){
		Chat.blur()
	}
})
	*/

function detectMob() {
	const toMatch = [
		/Android/i,
		/webOS/i,
		/iPhone/i,
		/iPad/i,
		/iPod/i,
		/BlackBerry/i,
		/Windows Phone/i
	];
	return toMatch.some((toMatchItem) => {
		return navigator.userAgent.match(toMatchItem);
    });
}
window.edges = edges;
window.Users = Users;
window.flvPlayer = flvPlayer;
window.personajes = personajes;
window.onLoadMedia = onLoadMedia

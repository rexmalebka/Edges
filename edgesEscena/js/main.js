"use strict";
import * as THREE from '/js/three/build/three.module.js';
import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';
import * as flvPlayer from '/js/flv.min.js';
import { Server, Users, chat} from '/js/Server.js';
import { Fire } from '/js/Fire.js'; 

// Aqui?

const personajes = {}
const edges = {
	init: function(){
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500)
		this.camera.position.z = 800;
		//this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
		this.renderer  = new THREE.WebGLRenderer({ antialias: true })

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		document.querySelector('#distopia').appendChild(this.renderer.domElement)

		this.controls = new PointerLockControls(this.camera, document.body)
		this.scene.background = new THREE.CubeTextureLoader().setPath('/img/').load([
			'px.jpg',
			'nx.jpg',
			'py.jpg',
			'ny.jpg',
			'pz.jpg',
			'nz.jpg'
		]);
		
		
		let light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.05 );
		light.position.set( 0, 30, 0 );
		this.scene.add( light );

		this.addFloor();

		this.addCiudad();
		//this.addHuachimontones();

		this.addZordon();
		this.addScreen

		this.addLightCiudad();
		this.addLightHuachimontones();

		//this.addAudio()
	        this.addScreen()
	        this.mkSat()

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
	
		
		var floorTexture = new THREE.TextureLoader().load( 'img/texture.jpg', function ( floorTexture ) {
			floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
			floorTexture.offset.set( 0, 0 );
			floorTexture.repeat.set( 40, 40 );
		});
		
		let floorMaterial = new THREE.MeshStandardMaterial( {
			color: 0xffffff,
			metalness: 0.5,
			roughness: 0.85,
			map: floorTexture,
                        //transparent: true,
                        //opacity: 0.75,
                });
		
		let floor = new THREE.Mesh( floorGeometry, floorMaterial );
		let wetfloor = new THREE.Mesh( wetfloorGeometry, pilaresMaterial); 
		
		
		wetfloor.position.y = -4;   
		floor.position.y = -4;

                this.scene.add( floor );
            // this.scene.add (wetfloor);
	},
	addLightHuachimontones: function(){

		this.light1 = new THREE.PointLight(0xa58ea8, 0.5)
		this.light2 = new THREE.PointLight(0x7d2f74, 0.5)
		this.light3 = new THREE.PointLight(0x2a315b, 0.5)
		this.light4 = new THREE.PointLight(0x4484b0, 0.5)
	
		this.scene.add( this.light1 )
		this.scene.add( this.light2 )
		this.scene.add( this.light3 )
		this.scene.add( this.light4 )

	},
	addLightCiudad: function(){
		this.clight1 = new THREE.PointLight(0xa58ea8, 0.5)
		this.clight2 = new THREE.PointLight(0x7d2f74, 0.5)
		this.clight3 = new THREE.PointLight(0x2a315b, 0.5)
		this.clight4 = new THREE.PointLight(0x4484b0, 0.5)
		
		this.scene.add( this.clight1 )
		this.scene.add( this.clight2 )
		this.scene.add( this.clight3 )
		this.scene.add( this.clight4 )
	},
    addHuachimontones: function(){

	/*
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
	*/
	},
	addCiudad: function(){
		//let cityLoader = new THREE.TextureLoader();
		
		//let cityGeometry = new THREE.BoxGeometry(10, 10, 10);

	    let cityGeometry = new THREE.TorusKnotBufferGeometry(15, 0.5, 100, 16 );

/*	    
		let cityTexture = cityLoader.load( 'img/after.jpg', function ( cityTexture ) {
			cityTexture.wrapS = cityTexture.wrapT = THREE.RepeatWrapping;
			cityTexture.offset.set( 0, 0 );
			cityTexture.repeat.set( 0.5, 0.5 );
		});

*/
		
		var cityMaterial = new THREE.MeshStandardMaterial( {
			
			color: 0xffffff,
			metalness: 0.9,
			roughness: 0.49,
                        //envmap: scene.background,
                        //side: THREE.DoubleSide,
                        // map: cityTexture,
                        //transparent: true,
                        //opacity: 0.75,
                } );
		let tam;


	    		      for(var i = 0; i < 20; i++){
			  for(var j = 0; j < 20; j++){
			      var city = new THREE.Mesh( cityGeometry, cityMaterial );
			      //city.wireframe = true;
			      //city.wireframeLinewidth = 2; 
			      tam = Math.random() * 320; 
			      
			      city.position.x = i * 100 - 1000; 
			      city.position.z = j* 100 - 1000;
			      city.position.y = tam  ; 
			      city.scale.x = 3;
			      city.scale.y = 3;
			      city.scale.z = 3; 
			      city.rotation.x = Math.PI /2 * Math.random(); 
			      this.scene.add( city);
			  }
		      }

	    /*
		      for(var i = 0; i < 10; i++){
			  for(var j = 0; j < 12; j++){
			      var city = new THREE.Mesh( cityGeometry, cityMaterial);
			      //city.wireframe = true;
			      //city.wireframeLinewidth = 2; 
			      tam = Math.random() * 160; 
			      
			      city.position.x = i * 50+200; 
			      city.position.z = j*50+400;
			      city.position.y = tam; 
			      city.scale.x = 3;
			      city.scale.y = 3;
			      city.scale.z = 3; 
			      
			      this.scene.add( city);
			  }
		      }

	    */

	},
	addZordon: function(){
		this.zordonGeometry = new THREE.CylinderGeometry(150,150,270, 32, 1, true, 0, Math.PI );		
		this.zordonTexture = new THREE.VideoTexture(  document.getElementById( 'streaming-video' ) );
		
		this.zordonMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			//metalness: 0.2,
			//roughness: 0.6,
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
	addAudio: function(element){
		let fftSize = 2048;
		const listener = new THREE.AudioListener();
		//camera.add( listener ); // Si es positionalAudio
		
		const audio = new THREE.Audio( listener );

                //var audio = new THREE.PositionalAudio( listener ); // Sustituir por Three.audio

                // audio.setRefDistance( 2 );
                // audio.setDirectionalCone( 180, 230, 0.1 );

                audio.setMediaElementSource(  element );

	    /*
		let aSourceMaterial = new THREE.MeshStandardMaterial( {
			color: 0xffffff,
			envMap: this.scene.background,
			refractionRatio: 0.75
		} );
	    */

	    
	    this.analyser = new THREE.AudioAnalyser( audio, fftSize );
		
		
		/////////// 
		
		let audioSphere =  new THREE.SphereGeometry(400, 32, 32);
		let audioSphereOrg =  new THREE.SphereGeometry(400, 32, 32);
		
		
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
                sphere.position.y = 300; 
            //sphere.rotation.x = Math.PI ;     
                this.scene.add(sphere);
		
		this.sphere = sphere
		this.audioSphere = audioSphere
		this.audioSphereOrg = audioSphereOrg

		
		let cilMaterial = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			envMap: this.scene.background,
			refractionRatio: 0.95
		} );


	    /*
		let geometryCli, cil1;

		for(let i = 1; i < 14; i++){
			geometryCli = new THREE.CylinderBufferGeometry(200-(i*3), 200-(i*3), 4, 128);
			geometryCli.computeVertexNormals();
			cil1 = new THREE.Mesh( geometryCli, cilMaterial );
			cil1.position.y = i*1.5-6;
			cil1.position.z = -500;
			this.scene.add( cil1 );
		}

	    */
	},

    addScreen: function(){

	this.clock = new THREE.Clock();
	
	var fireLoader = new THREE.TextureLoader();
	//fireLoader.crossOrigin = '';
	
	var fireTex = fireLoader.load("/img/mor.png");
	
	    var wireframeMat = new THREE.MeshBasicMaterial({
		color : new THREE.Color(0xffffff),
		wireframe : true
	    });


	this.fire = new Fire(fireTex);
	
	var wireframe = new THREE.Mesh(this.fire.geometry, wireframeMat.clone());
	this.fire.add(wireframe);
	wireframe.visible = true;
	wireframe.visible = false;
	
	console.log(this.fire);
	//this.fire.position.set(0, 0, 0);
	this.fire.position.y = 160;
	this.fire.position.x = -200; 
	this.fire.scale.x = 180;
	this.fire.scale.y = 300;
	this.fire.scale.z = 180; 
	
	this.fire.matrixWorldNeedsUpdate = true; 

	this.scene.add(this.fire);

	this.fire2 = new Fire(fireTex);
	
	var wireframe = new THREE.Mesh(this.fire2.geometry, wireframeMat.clone());
	this.fire2.add(wireframe);
	wireframe.visible = true;
	wireframe.visible = false;
	
	console.log(this.fire);
	//this.fire.position.set(0, 0, 0);
	this.fire2.position.y = 160;
	this.fire2.position.x = 200; 
	this.fire2.scale.x = 180;
	this.fire2.scale.y = 300;
	this.fire2.scale.z = 180; 
	
	this.fire2.matrixWorldNeedsUpdate = true; 

	this.scene.add(this.fire2);

	
	var aSourceMaterial = new THREE.MeshStandardMaterial( {
	    
	    color: 0xffffff,
	    metalness: 0.9,
	    roughness: 0.49,
            //envmap: scene.background,
            //side: THREE.DoubleSide,
            // map: cityTexture,
            //transparent: true,
            //opacity: 0.75,
        } );
	
	let aSourceGeometry = new THREE.BoxGeometry(100, 20, 100);

        //aSource.add( positionalAudio ); // asociar el audio a una fuente

	for(var i = 0; i < 2; i++){
	    let aSource = new THREE.Mesh( aSourceGeometry, aSourceMaterial );
	    aSource.position.x = -600 + ((i+1) *400);
	 
            this.scene.add(aSource);
	 
	}

	    
	let screensGeometry = new THREE.PlaneGeometry( 400, 200, 8 );
	
	let screen;
	    
		for(let i = 0; i < 3; i++){		
		    screen = new THREE.Mesh(screensGeometry, this.zordonMaterial);
		    
		    screen.position.z = 200 + ((i+1)*200);
		    screen.position.x = 40+(((3-i)+1)*150);
		    screen.position.y = 100;
		    
		    screen.rotation.y = -Math.PI; 
		    
                    this.scene.add(screen);
		}


                for(var i = 0; i < 3; i++){
		    screen = new THREE.Mesh(screensGeometry, this.zordonMaterial);

		    screen.position.z = 200 + ((i+1)*200);
		    screen.position.x = -40+(((3-i)+1)* -150);
		    screen.position.y = 100;
		    
		    screen.rotation.y = -Math.PI; 

		    this.scene.add(screen);
		}

	},


    mkSat: function(){
/*
	// Satelite

	let group = new THREE.Group();
	this.sats = new THREE.Group();
	
	var satBodyMaterial = new THREE.MeshStandardMaterial( {
			  color: 0xffd700,
			  envMap: this.scene.background,
			  //refractionRatio: 0.75
			  metalness: 0.7,
			  roughness: 0.1
	} );

		      
		      var satBodyGeometry = new THREE.CylinderGeometry( 15, 15, 40, 32 );

		      var satBodyMesh = new THREE.Mesh(satBodyGeometry, satBodyMaterial);

		      satBodyMesh.position.y = 40;
		      satBodyMesh.position.z = 0; 
		      satBodyMesh.rotation.x = Math.PI /2;
		      group.add(satBodyMesh);

		      var satHeadMaterial = new THREE.MeshStandardMaterial( {
			  color: 0xffffff,
			  envMap: this.scene.background,
			  side: THREE.DoubleSide,
			  metalness: 0.7,
			  roughness: 0.5
			  //refractionRatio: 0.75
		      } );
		      

		      var satHeadGeometry = new THREE.SphereBufferGeometry(25, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);

		      var satHeadGeometry2 = new THREE.SphereGeometry(4, 20, 20);

		      var satHeadMesh2 = new THREE.Mesh(satHeadGeometry2, satHeadMaterial); 

		      satHeadMesh2.position.z = 55;
		      satHeadMesh2.position.y = 40; 
		      
		      group.add(satHeadMesh2); 

		      var satHeadMesh = new THREE.Mesh(satHeadGeometry, satHeadMaterial);

		      satHeadMesh.position.y = 40; 
		      satHeadMesh.position.z = 45;
		      satHeadMesh.rotation.x = -Math.PI /2; 

		      group.add(satHeadMesh); 


		       var satWingsMaterial = new THREE.MeshStandardMaterial( {
			  color: 0x3377FF,
			  envMap: this.scene.background,
			  side: THREE.DoubleSide,
			  metalness: 0.7,
			  roughness: 0.1
			  //refractionRatio: 0.75
		      } );
		      
		      var satWingsGeometry = new THREE.PlaneGeometry(20, 40, 10);


		      for(var i = 0; i < 5; i++){
			  
		      var satWingsMesh = new THREE.Mesh(satWingsGeometry, satWingsMaterial);


			  satWingsMesh.position.z = 0;
			  
			  satWingsMesh.position.y = 40;
			  satWingsMesh.position.x = 25 + (i*25); 
			  //satWingsMesh.rotation.x = -Math.PI / 2; 
			  group.add(satWingsMesh); 

		      }

		      
		      for(var i = 0; i < 5; i++){
			  
		      var satWingsMesh = new THREE.Mesh(satWingsGeometry, satWingsMaterial);


			  satWingsMesh.position.z = 0; 
			  satWingsMesh.position.y = 40;
			  satWingsMesh.position.x = -25 + (i*-25); 
			  //satWingsMesh.rotation.x = -Math.PI / 2; 
			  group.add(satWingsMesh); 

		      }

	
		      for(var i = 0; i < 4; i++){
			  edges.sats[i] = group.clone(); 
			  edges.sats[i].scale.x = 0.4; 
			  edges.sats[i].scale.y = 0.4;
			  edges.sats[i].scale.z = 0.4; 
			  this.scene.add(edges.sats[i]);
		      }

*/
    },

    moveSat: function(){

	/*
	var time = Date.now() * 0.0005;

	
	for(var i = 0; i < 4; i++){
	    edges.sats[i].lookAt(0, 0, 500); 
	}

	edges.sats[0].position.x = Math.sin( time * 0.7/2 ) * 400;
	edges.sats[0].position.y = 500 +Math.cos( time * 0.5/2 ) * 50;
	edges.sats[0].position.z = 800+Math.cos( time * 0.3/2 ) * 400;
	
        edges.sats[1].position.x = Math.cos( time * 0.3/2 ) * 400;
        edges.sats[1].position.y = 500+Math.sin( time * 0.5/2 ) * 50;
	edges.sats[1].position.z = 800+Math.sin( time * 0.7/2 ) * 400;
	
	edges.sats[2].position.x = Math.cos( time * 0.7/2 ) * 400;
	edges.sats[2].position.y = 500+Math.cos( time * 0.3/2 ) * 50;
	edges.sats[2].position.z = 800+Math.sin( time * 0.5/2 ) * 400;
	
	edges.sats[3].position.x = Math.sin( time * 0.3/2 ) * 400;
	edges.sats[3].position.y = 500+Math.cos( time * 0.7/2 ) * 50;
	edges.sats[3].position.z = 800+Math.sin( time * 0.5/2 ) * 400;
*/
	
    },
    
	moveAudioSphere: function(){
		let data = edges.analyser.getFrequencyData();
		edges.sphere.geometry.verticesNeedUpdate = true;  // Necessary to update
		
		for (let i = 0, len = edges.audioSphere.vertices.length; i < len; i++) {
			//audioSphere.vertices[i].y = audioSphereOrg.vertices[i].y;
                        edges.audioSphere.vertices[i].y = edges.audioSphereOrg.vertices[i].y * (1+data[i] / 256) ;
                        edges.audioSphere.vertices[i].x = edges.audioSphereOrg.vertices[i].x * (1+data[i] / 256);
                        edges.audioSphere.vertices[i].z = edges.audioSphereOrg.vertices[i].z * (1+data[i] / 256);
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
	    
	    edges.clight1.position.x = Math.sin( time * 0.7/2 ) * 400;
	    edges.clight1.position.y = 500 +Math.cos( time * 0.5/2 ) * 50;
	    edges.clight1.position.z = 800+Math.cos( time * 0.3/2 ) * 400;
	
            edges.clight2.position.x = Math.cos( time * 0.3/2 ) * 400;
            edges.clight2.position.y = 500+Math.sin( time * 0.5/2 ) * 50;
	    edges.clight2.position.z = 800+Math.sin( time * 0.7/2 ) * 400;
	    
	    edges.clight3.position.x = Math.cos( time * 0.7/2 ) * 400;
	    edges.clight3.position.y = 500+Math.cos( time * 0.3/2 ) * 50;
	    edges.clight3.position.z = 800+Math.sin( time * 0.5/2 ) * 400;
	    
	    edges.clight4.position.x = Math.sin( time * 0.3/2 ) * 400;
	    edges.clight4.position.y = 500+Math.cos( time * 0.7/2 ) * 50;
	    edges.clight4.position.z = 800+Math.sin( time * 0.5/2 ) * 400;

	    var delta = edges.clock.getDelta();
	    
	    //var t = clock.elapsedTime * controller.speed;
	    var t = edges.clock.elapsedTime;
	    edges.fire.update(t);
	    edges.fire2.update(t);
	    
	    
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
		if (edges.streamingAudio) edges.moveAudioSphere()
		edges.moveLight();
		edges.moveSat(); 
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
	streamingAudio: false,
};

let ctrl = false

function onKeyDown(event) {
        switch (event.keyCode) {
                case 38: // up
                case 87: // w
                        if(document.activeElement == document.body) edges.moveForward = true
                        break

                case 37: // left
                case 65: // a
                        if(document.activeElement == document.body) edges.moveLeft = true
                        break

                case 40: // down
                case 83: // s
                        if(document.activeElement == document.body) edges.moveBackward = true
                        break
                case 39: // right
                case 68: // d
                        if(document.activeElement == document.body) edges.moveRight = true
                        break
                case 32: // space
                        if (edges.canJump === true) // velocity.y += 350
                        { edges.canJump = false }
                        break
                case 17:
                        ctrl = true;
                case 13:
                        // chat
                        if(document.activeElement != document.querySelector("#inputMensaje")) break
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
                        if(document.activeElement == document.body) edges.moveForward = false
                        break
                case 37: // left
                case 65: // a
                        if(document.activeElement == document.body) edges.moveLeft = false
                        break

                case 40: // down
                case 83: // s
                        if(document.activeElement == document.body) edges.moveBackward = false
                        break

                case 39: // right
                case 68: // d
                        if(document.activeElement == document.body) edges.moveRight = false
                        break
                case 84:
                        // t
                        document.querySelector("#chat").style.display = ''
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
	let audio = new Audio('http://134.122.125.230:8001/distopia.ogg');
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
	edges.scene.remove(personajes[uuid])
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
  
        const position = Users[uuid].position
	
	const geom = new THREE.SphereBufferGeometry(5, 32, 32)
	const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 })
	const mimir = new THREE.Mesh(geom, mat)
	
	mimir.position.x = position.x
	mimir.position.y = position.y
	mimir.position.z = position.z
        if(uuid == 'me'){
		edges.camera.position.x = position.x
		edges.camera.position.y = position.y
		edges.camera.position.z = position.z
        }

	document.querySelector("#numUsuarios").textContent = Object.keys(Users).length

    /// Aquí va el avatar
    
       /* 
	// model
	console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
	var loader = new THREE.FBXLoader();
	loader.load( '/models/fbx/monito.fbx', function ( object ) {
                personajes[uuid] = object
                console.log("UWU")

        });
       */

    /*
    var loader = new THREE.GLTFLoader();

    loader.load(
	// resource URL
	'models/hand.glb',
	// called when the resource is loaded
	function ( gltf ) {
	    
	    gltf.scene.scale.set(10,10,10) // scale here
	    gltf.scene.position.set(0, 0, 0); 
	    //scene.add( gltf.scene );
	    personajes[uuid] = gltf.scene; 
	    
	    //gltf.animations; // Array<THREE.AnimationClip>
	    //gltf.scene; // THREE.Group
	    //gltf.scenes; // Array<THREE.Group>
	    //gltf.cameras; // Array<THREE.Camera>
	    //gltf.asset; // Object
	    
	},
    );
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

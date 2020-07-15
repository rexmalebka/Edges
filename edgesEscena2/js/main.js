"use strict";
import * as THREE from '/js/three/build/three.module.js';
import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';
import * as flvPlayer from '/js/flv.min.js';
import { Server, Users } from '/js/Server.js';
import { Chat } from '/js/chat.js';
const personajes = {}

let alarma = setInterval(function(){
    
    var today = new Date();
    var utcdate = today.getUTCDate();
    var utchours = today.getUTCHours();
    var utcminutes = today.getUTCMinutes();

    //var myVar = setInterval(myTimer, 1000);
    
    if(utcdate >= 14 && utchours >= 6 && utcminutes >=55 ){
	console.log("ya paso");
	clearInterval(alarma);
	edges.sound1.stop();
	edges.sound2.stop();
	edges.sound3.stop();
	edges.sound4.stop(); 

	
    }
    
}, 2000)

const edges = {
	init: function(){
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500)
		this.camera.position.z = 400;
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
		this.addHuachimontones();

	    this.addZordon();
	    this.addScreen(); 
	    this.addVideo();

	    this.addLightCiudad();
	    this.addLightHuachimontones();
	    this.mkAvatar(); 
	    
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
	
		
	    var floorTexture = new THREE.TextureLoader().load( 'img/city6.jpg', function ( floorTexture ) {
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.offset.set( 0, 0 );
		floorTexture.repeat.set( 40, 40 );
	    });
	    
		let floorMaterial = new THREE.MeshStandardMaterial( {
			color: 0xffffff,
			metalness: 0.5,
			roughness: 0.65,
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

		this.light1 = new THREE.PointLight(0x63a4c6, 0.125)
		this.light2 = new THREE.PointLight(0xb2cadf, 0.125)
		this.light3 = new THREE.PointLight(0x3e689f, 0.125)
		this.light4 = new THREE.PointLight(0x9360c8, 0.125)
	
		this.scene.add( this.light1 )
		this.scene.add( this.light2 )
		this.scene.add( this.light3 )
		this.scene.add( this.light4 )

	},
	addLightCiudad: function(){
		this.clight1 = new THREE.PointLight(0x63a4c6, 0.125)
		this.clight2 = new THREE.PointLight(0xb2cadf, 0.125)
		this.clight3 = new THREE.PointLight(0x3e689f, 0.125)
		this.clight4 = new THREE.PointLight(0x9360c8, 0.125)
		
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
		
	    const pilaresGeometry = new THREE.BoxGeometry(40, 40, 40);
	    let tam;
	    
	    for(let i = 0; i < 50 ; i ++){
			const cube = new THREE.Mesh( pilaresGeometry, pilaresMaterial );
			cube.position.x = 600 - Math.random() * 400 ;
			//cube[i].position.y = Math.random() * 400 -200;
			cube.position.z = Math.random() * 800 - 900;
			tam = Math.random() * 100;
			cube.scale.x = 0.2;
			cube.scale.y = tam;
			cube.scale.z = 0.2;
			this.scene.add(cube);
	    }

	    
	    for(let i = 0; i < 50 ; i ++){
		const cube = new THREE.Mesh( pilaresGeometry, pilaresMaterial );
		cube.position.x = -600 + Math.random() * 400 ;
		//cube[i].position.y = Math.random() * 400 -200;
		cube.position.z = Math.random() * 800 - 900;
		tam = Math.random() * 100;
		cube.scale.x = 0.2;
		cube.scale.y = tam;
		cube.scale.z = 0.2;
		this.scene.add(cube);
	    }

	    
	    
	    for(let i = 0; i < 25 ; i ++){
		const cube = new THREE.Mesh( pilaresGeometry, pilaresMaterial );
		cube.position.x = -300+Math.random() * 600 ;
		//cube[i].position.y = Math.random() * 400 -200;
		cube.position.z = Math.random() * 800 - 1500;
		tam = Math.random() * 100;
		cube.scale.x = 0.2;
		cube.scale.y = tam;
		cube.scale.z = 0.2;
		this.scene.add(cube);
	    }

	   
	},
	addCiudad: function(){
		let cityLoader = new THREE.TextureLoader();
		
		let cityGeometry = new THREE.BoxGeometry(10, 10, 10);
		
		let cityTexture = cityLoader.load( 'img/after.jpg', function ( cityTexture ) {
			cityTexture.wrapS = cityTexture.wrapT = THREE.RepeatWrapping;
			cityTexture.offset.set( 0, 0 );
			cityTexture.repeat.set( 0.5, 0.5 );
		});
		
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


	    		      for(var i = 0; i < 10; i++){
			  for(var j = 0; j < 18; j++){
			      var city = new THREE.Mesh( cityGeometry, cityMaterial );
			      //city.wireframe = true;
			      //city.wireframeLinewidth = 2; 
			      tam = Math.random() * 300; 
			      
			      city.position.x = i * 50 - 650; 
			      city.position.z = j* 50 + 200;
			      city.position.y = tam  ; 
			      city.scale.x = 3;
			      city.scale.y = 3;
			      city.scale.z = 3; 
			      
			      this.scene.add( city);
			  }
		      }
		      
		      for(var i = 0; i < 10; i++){
			  for(var j = 0; j < 18; j++){
			      var city = new THREE.Mesh( cityGeometry, cityMaterial);
			      //city.wireframe = true;
			      //city.wireframeLinewidth = 2; 
			      tam = Math.random() * 300; 
			      
			      city.position.x = i * 50+200; 
			      city.position.z = j*50+200;
			      city.position.y = tam; 
			      city.scale.x = 3;
			      city.scale.y = 3;
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
			//metalness: 0.6,
			//roughness: 0.7, 
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

	        this.analyser = new THREE.AudioAnalyser( audio, fftSize );

	    /*
		let aSourceMaterial = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			envMap: this.scene.background,
			refractionRatio: 0.75
		} );
		
		let aSourceGeometry = new THREE.BoxGeometry(20, 20, 20);
		let aSource = new THREE.Mesh( aSourceGeometry, aSourceMaterial );

	    */
	    
                //aSource.add( positionalAudio ); // asociar el audio a una fuente

                // this.scene.add(aSource);
/*
            this.analyser = new THREE.AudioAnalyser( audio, fftSize );

	    var today = new Date();
	    var utcdate = today.getUTCDate();
	    var utchours = today.getUTCHours();
	    var utcminutes = today.getUTCHours();

	    
	    var myVar = setInterval(myTimer, 1000);

	    
	    if(utcdate >= 14 || utchours >= 6  || utcminutes >=40 ){
		console.log(hours);
	
	    }
*/
		/////////// 
		
		let audioSphere =  new THREE.SphereGeometry(60, 32, 32);
		let audioSphereOrg =  new THREE.SphereGeometry(60, 32, 32);
		
		
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

	    
	}
	    
	
	    
	

	
	/*
	var video2 = document.getElementById( 'video2' );
	video2.play();
	video2.addEventListener('play', function() {
	    this.currentTime = 3;
	}, false);
	
	let texture2 = new THREE.VideoTexture( video2 );

	let videoGeometry2 = new THREE.PlaneGeometry(100, 100, 8);
	let videoMaterial2 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture2 } );

	let videoMesh2 = new THREE.Mesh(videoGeometry2, videoMaterial2);
	videoMesh2.position.x = -100; 
	edges.scene.add(videoMesh2);
	*/

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


    mkSat: function(){

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

	
	var satHeadGeometry3 = new THREE.SphereGeometry(8, 20, 20);

	
	var satHeadMesh2 = new THREE.Mesh(satHeadGeometry2, satHeadMaterial); 

	
	satHeadMesh2.position.z = 55;
	satHeadMesh2.position.y = 40; 
	
	group.add(satHeadMesh2); 
	
	var satHeadMesh = new THREE.Mesh(satHeadGeometry, satHeadMaterial);
	
	satHeadMesh.position.y = 40; 
	satHeadMesh.position.z = 45;
	satHeadMesh.rotation.x = -Math.PI /2; 
	
	group.add(satHeadMesh); 
	
	var satHeadMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffffff })
	var satHeadMesh3 = new THREE.Mesh(satHeadGeometry3, satHeadMaterial2);

	satHeadMesh3.position.z = 55;
	satHeadMesh3.position.y = 40;
	satHeadMesh3.position.x = 40;

	group.add(satHeadMesh3); 

	
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


	
	var sphereSats = new THREE.BoxGeometry( 20, 20, 16 );
	var material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
	
	
	// Sonidos
	
	var listener = new THREE.AudioListener();
	edges.camera.add( listener );
	
	var audioLoader = new THREE.AudioLoader();
	
	this.sound1 = new THREE.PositionalAudio( listener );
	this.sound2 = new THREE.PositionalAudio( listener );
	this.sound3 = new THREE.PositionalAudio( listener );	    
	this.sound4 = new THREE.PositionalAudio( listener );
	
	
	audioLoader.load( '/audio/0.mp3', function( buffer ) {
	    edges.sound1.setBuffer( buffer );
	    edges.sound1.setLoop(true);
	    edges.sound1.setRefDistance( 80 );
	    //edges.sound1.play();
	    edges.sound1.setVolume(1);
	    });
	
	
	audioLoader.load( '/audio/1.mp3', function( buffer ) {
	    edges.sound2.setBuffer( buffer );
	    edges.sound2.setLoop(true);
	    edges.sound2.setRefDistance( 80 );
	    //edges.sound2.play();
	    edges.sound2.setVolume(1);
	});

	
	audioLoader.load( '/audio/2.mp3', function( buffer ) {
	    edges.sound3.setBuffer( buffer );
	    edges.sound3.setLoop(true);
	    edges.sound3.setRefDistance( 80 );
	    //edges.sound3.play();
	    edges.sound3.setVolume(1);
	});
	
	audioLoader.load( '/audio/3.mp3', function( buffer ) {
	    edges.sound4.setBuffer( buffer );
	    edges.sound4.setLoop(true);
	    edges.sound4.setRefDistance( 80 );
	    //edges.sound4.play();
	    edges.sound4.setVolume(1);
	});
	
	
	    
	
	for(var i = 0; i < 4; i++){

	    edges.sats[i] = group.clone();
	    	    
	    //edges.sats[i].add( sound ); 

	    edges.sats[i].scale.x = 0.4; 
	    edges.sats[i].scale.y = 0.4;
	    edges.sats[i].scale.z = 0.4;
	    
	    this.scene.add(edges.sats[i]);
	 
	}

	
	edges.sats[0].add( this.sound1 );	
	edges.sats[1].add( this.sound2 );
	edges.sats[2].add( this.sound3 );
	edges.sats[3].add( this.sound4 );
	
	

    },

    moveSat: function(){

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
			//Users.me.position.y = camPos.y
			Users.me.position.z = camPos.z

		    const rotPos = edges.camera.rotation
		    //Users.me.rotation.x = rotPos.x
		    Users.me.rotation.y = rotPos.y
		    //Users.me.rotation.z = rotPos.z
		    
			personajes.me.position.x = camPos.x
			//personajes.me.position.y = camPos.y 
			personajes.me.position.z = camPos.z
			if(!edges.moving){
				edges.stoping = false
				edges.moving = setInterval(function(){
				    Users.me.move();
				    Users.me.rotate(); 
				},400)
			}
		}else{
			clearInterval(edges.moving)
			if(!edges.stoping && edges.moving){
				edges.stoping = true
			    Users.me.move()
			    Users.me.rotate()
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
		case 't':
                case 'T':
                        if(document.activeElement != document.querySelector("#usuarix")){
                                document.querySelector("#chat").style.display = ''
                                document.querySelector('#inputMensaje').focus()
                                edges.moveForward = false
                                edges.moveLeft = false
                                edges.moveBackward = false
                                edges.moveRight = false
                        }
                        break

        }
}


function onWindowResize() {
	edges.camera.aspect = window.innerWidth / window.innerHeight
	edges.camera.updateProjectionMatrix()
	edges.renderer.setSize(window.innerWidth, window.innerHeight)
}

function onLoadMedia(){

    edges.sound1.play();
    edges.sound2.play();
    edges.sound3.play();
    edges.sound4.play(); 
    
    let alarma = setInterval(function(){

        var today = new Date();
        //var utcdate = today.getUTCDate();
        //var utchours = today.getUTCHours();
        //var utcminutes = today.getUTCMinutes();
        var fechaGmt = new Date(Date.UTC(20, 7, 14, 9, 0, 0));

        //var myVar = setInterval(myTimer, 1000);

        console.log();
        if( today >= fechaGmt ){
            console.log("ya paso");
            clearInterval(alarma);
            edges.sound1.stop();
            edges.sound2.stop();
            edges.sound3.stop();
            edges.sound4.stop();
        }

    }, 2000)


	let audio = new Audio('http://104.248.59.232:8001/distopia.ogg');
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
        if(document.activeElement == document.querySelector("#inputMensaje")){
		// mostrarChat()
		document.querySelector("#inputMensaje").blur()
		document.querySelector("#chat").style.display = 'none'
		document.querySelector("body").focus();
		edges.controls.lock()
	}else{
		document.querySelector("#instructions").style.display = "";
		document.querySelector("#blocker").style.display = "";
	}
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
        monito.add( text );

	edges.scene.add( monito );
	personajes[uuid] = monito;

    	
    });

    if(uuid == 'me'){
	edges.camera.position.x = position.x
	edges.camera.position.y = 14
	edges.camera.position.z = position.z
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
    
    console.log("adding user:", uuid)
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
	console.debug(content, '<-')
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
	console.log("000", document.querySelector("#usuarix").value)
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

document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)

document.querySelector('#usuarix').addEventListener('change', cambiarNombre)
document.querySelector('#usuarix').addEventListener('keydown', cambiarNombre)
document.querySelector("#instructions").addEventListener('click', ()=> edges.controls.lock())
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

window.addEventListener('blur', function(e){
	if(!edges.controls.isLocked) return
	document.querySelector("#chat").style.display = 'none'
	document.querySelector("#instructions").style.display = "block";
	document.querySelector("#blocker").style.display = "";
})
edges.init();
Chat.init()
Server.init();

document.querySelector('#usuarix').value = Users.me.nickname
document.querySelector("#mostrarUsuarix").textContent = document.querySelector("#usuarix").value

window.edges = edges;
window.flvPlayer = flvPlayer;
window.personajes = personajes;

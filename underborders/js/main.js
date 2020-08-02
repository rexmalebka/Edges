"use strict";
import * as THREE from '/js/three/build/three.module.js';
import { controls } from '/js/Controls.js';
import * as flvPlayer from '/js/flv.min.js';
import { Server, Users } from '/js/Server.js';
import { Chat } from '/js/chat.js';
const personajes = {}

const edges = {
	init: function(){
	    this.scene = new THREE.Scene()
	    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500)
	    this.camera.position.z = 400;
	    //this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	    this.renderer  = new THREE.WebGLRenderer({ antialias: true })

	    this.renderer.setPixelRatio( window.devicePixelRatio );
	    this.renderer.setSize( window.innerWidth, window.innerHeight );
	    
	    document.querySelector('#distopia').appendChild(this.renderer.domElement)

	    // this.controls = new PointerLockControls(this.camera, document.body)
	    //this.controls = new PointerLockControls(this.camera, document.body)
	    this.controls = controls.init(this.camera)		//PointerLockControls(this.camera, document.body)

	    /*
	    this.scene.background = new THREE.CubeTextureLoader().setPath('/img/').load([
		    'px.jpg',
		    'nx.jpg',
		    'py.jpg',
		    'ny.jpg',
		    'pz.jpg',
		'nz.jpg'
	    ])

	    ;

	    let light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.05 );
	    light.position.set( 0, 30, 0 );
	    this.scene.add( light );
	    */
	    
	    this.addFloor()
	    this.addMaze()
	    
	    // this.addLightCiudad()
	    // this.addLightHuachimontones()
	    this.mkAvatar()
	    this.pasillo()
	    this.rotaciones()
	    //this.addAudio()
	    
	    this.animate();

	    window.addEventListener('resize', onWindowResize);
	    //this.controls.addEventListener('lock', onLock )
	    //this.controls.addEventListener('unlock', onUnlock )
	},
    
    addFloor: function(){

	let floorGeometry = new THREE.PlaneGeometry( 96*2+4, 96*2+4, 40, 40 );
	
	for (let i = 0; i < floorGeometry.vertices.length; i++) {
	    floorGeometry.vertices[i].z += (Math.random()*2)-1;
	}
	
	floorGeometry.rotateX( - Math.PI / 2 );
	
	//var texture = new THREE.TextureLoader().load( 'img/texture.jpg' );
	
	//texture.wrapS = THREE.RepeatWrapping;
	//texture.wrapT = THREE.RepeatWrapping;
	
	var floorTexture = new THREE.TextureLoader().load( 'img/stone.jpg', function ( floorTexture ) {
	    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	    floorTexture.offset.set( 0, 0 );
	    floorTexture.repeat.set( 8, 4 );
	});
	
	var groundMaterial = new THREE.MeshStandardMaterial( {
	    color: 0x808080,
	    metalness: 0.2,
	    roughness: 0.85,
	    map: floorTexture,
	    side: THREE.DoubleSide
            //transparent: true,
            //opacity: 0.75,
        });
	
	let floor = new THREE.Mesh( floorGeometry, groundMaterial );
	let floor2 = new THREE.Mesh( floorGeometry, groundMaterial );

	floor.position.y = 1; 
	floor2.position.y = 96/2-2;

	this.scene.add( floor );	
	this.scene.add( floor2 );

	
	var floorTexture2 = new THREE.TextureLoader().load( 'img/stone.jpg', function ( floorTexture2 ) {
	    floorTexture2.wrapS = floorTexture2.wrapT = THREE.RepeatWrapping;
	    floorTexture2.offset.set( 1, 0 );
	    floorTexture2.repeat.set( 1, 0.5 );
	});
	
	var groundMaterial2 = new THREE.MeshStandardMaterial( {
	    color: 0x808080,
	    metalness: 0.6,
	    roughness: 0.85,
	    map: floorTexture2,
	    side: THREE.DoubleSide
            //transparent: true,
            //opacity: 0.75,
        });

	let wallGeometry = new THREE.PlaneGeometry( 96*2.5+4, 96/2+4, 40, 40 );
	
	for (let i = 0; i < wallGeometry.vertices.length; i++) {
	    wallGeometry.vertices[i].z += (Math.random()*2)-1;
	}
	let wall1 = new THREE.Mesh(wallGeometry, groundMaterial2 );
	// wall1.rotation.x = Math.PI /2;
	wall1.position.y = 96/4;
	wall1.position.z = 96+3;
	wall1.position.x = -96/4;
	this.scene.add( wall1);

	let wall2 = new THREE.Mesh(wallGeometry, groundMaterial2 );
	// wall1.rotation.x = Math.PI /2;
	wall2.position.y = 96/4;
	wall2.position.z = -96-3;
	wall2.position.x = 96/4
	this.scene.add(wall2); 
		
	var sphgeometry = new THREE.SphereGeometry( 2, 32, 32 );
	var sphmaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );

	var fococine = new THREE.Mesh( sphgeometry, sphmaterial );

	let latlightv = new THREE.PointLight(  0x5691cc, 3, 200);

	fococine.position.y = latlightv.position.y = 96/2-5; 

	this.scene.add( latlightv ); 
	this.scene.add( fococine); 
	
    },

    pasillo: function(){

	// INICIALES
	
	let fc = 2.75;
	let w = 96; 

	/////////////
	/////////////
	// vueltas // 
	/////////////
	/////////////
	
	let vueltasGeometry = new THREE.PlaneGeometry( w/2-4, w/2-4, 20, 20 );
	

	for (let i = 0; i < vueltasGeometry.vertices.length; i++) {
	    vueltasGeometry.vertices[i].z += (Math.random()*1)-0.5;
	}
	
	vueltasGeometry.rotateX( - Math.PI / 2 );

	var vueltasTexture = new THREE.TextureLoader().load( 'img/stone.jpg', function ( vueltasTexture ) {
	    vueltasTexture.wrapS = vueltasTexture.wrapT = THREE.RepeatWrapping;
	    vueltasTexture.offset.set( 0, 0 );
	    vueltasTexture.repeat.set( 0.5, 0.5 );
	});

	var vueltasMaterial = new THREE.MeshStandardMaterial( {
	    color: 0x808080,
	    metalness: 0.2,
	    roughness: 0.85,
	    map: vueltasTexture,
	    side: THREE.DoubleSide
            //transparent: true,
            //opacity: 0.75,
        });

	var taGeometry = new THREE.BoxGeometry( 96/2-5, 2, 2 );
	var taMaterial = new THREE.MeshStandardMaterial( {
	    color: 0x808080,
	    metalness: 0.6,
	    roughness: 0.85,
	    map: vueltasTexture,
	    // side: THREE.DoubleSide
	} );
	
	var tabla = [];

	for( var i = 0; i < 12; i++){
	    tabla[i] = new THREE.Mesh( taGeometry, taMaterial );
	}
	
	var sphgeometry = new THREE.SphereGeometry( 2, 32, 32 );
	var sphmaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );

	var foco = new THREE.Mesh( sphgeometry, sphmaterial );
	let lightv = new THREE.PointLight( 0x01B8A0, 4, 180);
	// 0x5691cc
	foco.position.y = lightv.position.y = 96/2 -5;
	foco.position.x = lightv.position.x = 96/4-5;
	foco.position.z = lightv.position.z = -96/4+5;
	
	let posv1 = new THREE.Mesh( vueltasGeometry, vueltasMaterial );
	let posv2 = new THREE.Mesh( vueltasGeometry, vueltasMaterial );
	let posv3 = new THREE.Mesh( vueltasGeometry, vueltasMaterial ); 
	let posv4 = new THREE.Mesh( vueltasGeometry, vueltasMaterial ); 

	posv1.position.y = 96/2-2;
	
	posv3.rotation.x = Math.PI / 2;
	posv3.position.y = 96/4;
	posv3.position.z = -96/4+2; 

	posv4.rotation.z = Math.PI / 2;
	// posv4.rotation.y = Math.PI; 
	posv4.position.y = 96/4;
	posv4.position.x = 96/4-2;

	tabla[0].position.y = 1;
	tabla[0].position.z = -96/4+fc;

	tabla[1].position.y = 1;
	tabla[1].position.z = 96/4-fc;
	
	tabla[2].position.y = 96/2-fc;
	tabla[2].position.z = 96/4-fc;

	tabla[3].position.y = 96/2-fc;
	tabla[3].position.z = -96/4+fc;

	tabla[4].rotation.y = Math.PI/2; 
	tabla[4].position.y = 1;
	tabla[4].position.x = -96/4+fc;

	tabla[5].rotation.y = Math.PI/2; 
	tabla[5].position.y = 1;
	tabla[5].position.x = 96/4-fc;

	tabla[6].rotation.y = Math.PI/2; 
	tabla[6].position.y = 96/2-fc;
	tabla[6].position.x = 96/4-fc;

	tabla[7].rotation.y = Math.PI/2; 
	tabla[7].position.y = 96/2-fc;
	tabla[7].position.x = -96/4+fc;

	tabla[8].rotation.z = Math.PI/2;
	tabla[8].position.x = -96/4+fc;
	tabla[8].position.z = -96/4+fc;
	tabla[8].position.y = 96/4-1;

	tabla[9].rotation.z = Math.PI/2;
	tabla[9].position.x = 96/4-fc;
	tabla[9].position.z = -96/4+fc;
	tabla[9].position.y = 96/4-1;
	
	tabla[10].rotation.z = Math.PI/2;
	tabla[10].position.x = -96/4+fc;
	tabla[10].position.z = 96/4-fc;
	tabla[10].position.y = 96/4-1;
	
	tabla[11].rotation.z = Math.PI/2;
	tabla[11].position.x = 96/4-fc;
	tabla[11].position.z = 96/4-fc;
	tabla[11].position.y = 96/4-1;

	let grupov = new THREE.Group();	

	grupov.add( posv1 );
	grupov.add( posv2 );
	grupov.add( posv3 );
	grupov.add( posv4 );

	grupov.add( lightv );
	grupov.add( foco );

	for( var i = 0; i < 12; i++){
	    grupov.add(tabla[i]);
	}
	
	var torGeometry = new THREE.TorusKnotGeometry( 8, 0.75, 200, 16 );
	// var torMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	// child.geometry.computeVertexNormals();
	torGeometry.computeVertexNormals();
	
	var torMaterial = new THREE.MeshStandardMaterial( {
	    
	    color: 0xffffff,
	    metalness: 0.9,
	    roughness: 0.49,
            //envmap: scene.background,
            //side: THREE.DoubleSide,
            // map: cityTexture,
            //transparent: true,
            //opacity: 0.75,
        } );

	// El hijo 19
	
	var torusKnot = new THREE.Mesh( torGeometry, torMaterial );
	torusKnot.position.y = w/4; 
	grupov.add( torusKnot );
	
	this.vuelta1 = grupov.clone();

	// para el flyer solamente
	// this.vuelta1.remove(this.vuelta1.children[5]);

	this.vuelta1.position.x =  w - w*2.25;
	this.vuelta1.position.z = -w * 2.25;
	// vuelta1.castShadow = true;
	this.scene.add( this.vuelta1 );
	
	this.vuelta2 = grupov.clone();
	this.vuelta2.children[4].color.setHex(  0x5691cc ); 
	this.vuelta2.remove( this.vuelta2.children[3] ); 
	this.vuelta2.position.x =  w - w*3.75;
	this.vuelta2.position.z = -w * 2.25;
	this.vuelta2.rotation.y = Math.PI; 

	this.scene.add( this.vuelta2 );

	this.vuelta3 = grupov.clone();	
	this.vuelta3.children[4].color.setHex( 0xB80118 ); 
	//vuelta2.remove(vuelta2.children[3]); 
	this.vuelta3.position.x =  w - w*5.25;
	this.vuelta3.position.z = -w * 2.25;
	this.vuelta3.rotation.y = Math.PI; 
	this.scene.add( this.vuelta3 ); 
	
	this.vuelta4 = grupov.clone();

	this.vuelta4.position.x =  w - w*5.25;
	this.vuelta4.position.z = -w * 3.75;

	// vuelta1.castShadow = true;
		
	this.scene.add( this.vuelta4 );

	let vuelta5 = grupov.clone();
	
// 	vuelta5.children[4].color.setHex( 0xB80118 ); 

	vuelta5.children[4].color.setHex(  0x5691cc ); 
	
	//vuelta2.remove(vuelta2.children[3]); 
	
	vuelta5.position.x =  w - w*6.75;
	vuelta5.position.z = -w * 3.75;
	vuelta5.rotation.y = Math.PI; 
	
	this.scene.add( vuelta5 ); 


	let vuelta6 = grupov.clone();
	
// 	vuelta5.children[4].color.setHex( 0xB80118 ); 

	// vuelta6.children[4].color.setHex(  0x5691cc ); 

	vuelta6.children[4].color.setHex( 0xB80118 );
			
	let entGeometry = new THREE.PlaneGeometry( w/2, w/2, 20, 20 );
	
	var entMaterial = new THREE.MeshBasicMaterial( {
	    color: 0xffffff,
	    //metalness: 0.6,
	    //roughness: 0.85,
	    //map: floorTexture,
	    //side: THREE.DoubleSide
            //transparent: true,
            //opacity: 0.75,
        });

	let entMesh = new THREE.Mesh(entGeometry, entMaterial);

	entMesh.position.x = -w/4;
	entMesh.position.y = w/4;
	entMesh.rotation.y = Math.PI / 2; 
	
	vuelta6.add(entMesh); 

	
	//vuelta2.remove(vuelta2.children[3]); 
	
	vuelta6.position.x =  w - w*6.75;
	vuelta6.position.z = -w * 5.25;
	//vuelta6.rotation.y = Math.PI; 
	
	this.scene.add( vuelta6 ); 
	
	let vuelta7 = grupov.clone();

	vuelta7.position.x =  w * 1.25;
	vuelta7.position.z = -w * -2.25;
	vuelta7.rotation.y = Math.PI; 
	
	// vuelta1.castShadow = true;
		
	this.scene.add( vuelta7 );

	let vuelta8 = grupov.clone();
	
	vuelta8.children[4].color.setHex(  0x5691cc ); 

	vuelta8.remove(vuelta8.children[3]); 

	vuelta8.position.x =  w * 2.75;
	vuelta8.position.z = -w * -2.25;
	// vuelta8.rotation.y = -Math.PI; 

	this.scene.add( vuelta8 );

	let vuelta9 = grupov.clone();
	
	vuelta9.children[4].color.setHex( 0xB80118 ); 

	//vuelta2.remove(vuelta2.children[3]); 

	vuelta9.position.x =  w *4.25;
	vuelta9.position.z = -w * -2.25;
	// vuelta9.rotation.y = Math.PI /; 

	this.scene.add( vuelta9 ); 
	
	let vuelta10 = grupov.clone();
	
	// vuelta10.children[4].color.setHex( 0xB80118 ); 

	//vuelta2.remove(vuelta2.children[3]); 

	vuelta10.position.x =  w *4.25;
	vuelta10.position.z = -w * -3.75;
	vuelta10.rotation.y = Math.PI; 

	this.scene.add( vuelta10 ); 

	let vuelta11 = grupov.clone();
	
	vuelta11.children[4].color.setHex(  0x5691cc ); 

	//vuelta2.remove(vuelta2.children[3]); 

	vuelta11.position.x =  w *5.75;
	vuelta11.position.z = -w * -3.75;
	// vuelta11.rotation.y = Math.PI; 

	this.scene.add( vuelta11 );

	let vuelta12 = grupov.clone();
	
// 	vuelta5.children[4].color.setHex( 0xB80118 ); 

	// vuelta6.children[4].color.setHex(  0x5691cc ); 

	vuelta12.children[4].color.setHex( 0xB80118 );
	
	let entGeometry2 = new THREE.PlaneGeometry( w/2, w/2, 20, 20 );
	
	var entMaterial2 = new THREE.MeshBasicMaterial( {
	    color: 0xffffff,
	    //metalness: 0.6,
	    //roughness: 0.85,
	    //map: floorTexture,
	    //side: THREE.DoubleSide
            //transparent: true,
            //opacity: 0.75,
        });

	let entMesh2 = new THREE.Mesh(entGeometry2, entMaterial2 );

	entMesh2.position.x = -w/4;
	entMesh2.position.y = w/4;
	entMesh2.rotation.y = Math.PI / 2; 
	
	vuelta12.add(entMesh2); 
		
	//vuelta2.remove(vuelta2.children[3]); 
	
	vuelta12.position.x =  w * 5.75;
	vuelta12.position.z = -w * -5.25;
	vuelta12.rotation.y = Math.PI; 
	
	this.scene.add( vuelta12 ); 
		
	///////////////////////
	///////////////////////
	// PASILLOS CERRADOS //
	///////////////////////
	///////////////////////
	
	let posGeometry = new THREE.PlaneGeometry( w+5, w/2, 20, 20 );

	for (let i = 0; i < posGeometry.vertices.length; i++) {
	    posGeometry.vertices[i].z += (Math.random()*1)-0.5;
	}
	
	posGeometry.rotateX( - Math.PI / 2 );
	
	var floorTexture = new THREE.TextureLoader().load( 'img/stone.jpg', function ( floorTexture ) {
	    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	    floorTexture.offset.set( 0, 0 );
	    floorTexture.repeat.set( 1, 1 );
	});

	var grafTexture = new THREE.TextureLoader().load( 'img/graf01.png', function ( grafTexture ) {
	    //grafTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	    //grafTexture.offset.set( 0, 0 );
	    //grafTexture.repeat.set( 1.5, 1.5 );
	});

	var grafTexture2 = new THREE.TextureLoader().load( 'img/graf02.png', function ( grafTexture2 ) {
	    //grafTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	    //grafTexture.offset.set( 0, 0 );
	    //grafTexture.repeat.set( 1, 1 );
	});

	
	var grafTexture3 = new THREE.TextureLoader().load( 'img/spongebob.png', function ( grafTexture3 ) {
	    grafTexture3.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	    grafTexture3.offset.set( 0.85, 0 );
	    grafTexture3.repeat.set( 1.25, 1.25 );
	});

	
	var posMaterial = new THREE.MeshStandardMaterial( {
	    color: 0xffffff,
	    metalness: 0.6,
	    roughness: 0.85,
	    map: floorTexture,
	    side: THREE.DoubleSide
            //transparent: true,
            //opacity: 0.75,
        });

	
	var grafMaterial = new THREE.MeshStandardMaterial( {
	    color: 0xffffff,
	    metalness: 0.6,
	    roughness: 0.85,
	    map: grafTexture,
	    side: THREE.DoubleSide,
            transparent: true,
            overdraw: true
        });

	
	var grafMaterial2 = new THREE.MeshStandardMaterial( {
	    color: 0xffffff,
	    metalness: 0.6,
	    roughness: 0.85,
	    map: grafTexture2,
	    side: THREE.DoubleSide,
            transparent: true,
            overdraw: true
        });

	var grafMaterial3 = new THREE.MeshStandardMaterial( {
	    color: 0xffffff,
	    metalness: 0.6,
	    roughness: 0.85,
	    map: grafTexture3,
	    side: THREE.DoubleSide,
            transparent: true,
            overdraw: true
        });

	// TABLAS 

	var ta0Geometry = new THREE.BoxGeometry( 96+5, 2, 2 );
	var ta0Material = new THREE.MeshStandardMaterial( {
	    color: 0x808080,
	    metalness: 0.2,
	    roughness: 0.85,
	    map: floorTexture,
	    // side: THREE.DoubleSide
	} );
	
	var tabla0 = [];

	for( var i = 0; i < 4; i++){
	    tabla0[i] = new THREE.Mesh( ta0Geometry, ta0Material );
	}

	
	tabla0[0].position.y = 1;
	tabla0[0].position.z = -96/4+fc;

	tabla0[1].position.y = 1;
	tabla0[1].position.z = 96/4-fc;
	
	tabla0[2].position.y = 96/2-fc;
	tabla0[2].position.z = 96/4-fc;

	tabla0[3].position.y = 96/2-fc;
	tabla0[3].position.z = -96/4+fc;

	// MESHES Y POSICIÓN PASILLOS 
	
	let pos1 = new THREE.Mesh( posGeometry, posMaterial );
	let pos2 = new THREE.Mesh( posGeometry, posMaterial );
	let pos3 = new THREE.Mesh( posGeometry, posMaterial ); 
	let pos4 = new THREE.Mesh( posGeometry, posMaterial ); 

	let graf = new THREE.Mesh( posGeometry, grafMaterial2 );
	
	graf.material.needsUpdate = true;


	//let floor2 = new THREE.Mesh( floorGeometry, groundMaterial );

	pos1.position.y = 96/2-2;

	pos3.rotation.x = Math.PI / 2;
	pos3.position.y = 96/4;
	pos3.position.z = 96/4-2;

	pos4.rotation.x = Math.PI / 2;
	pos4.position.y = 96/4;
	pos4.position.z = -96/4+2;

	graf.rotation.x = Math.PI / 2;
	graf.position.y = 96/4;
	graf.position.z = -96/4+2;


	//graf.position.y = 96/2-2;

	// AGREGAR TODO A GRUPOS // 
	
	let grupo = new THREE.Group();	
	
	grupo.add( pos1 ); 
	grupo.add( pos2 );
	grupo.add( pos3 );
	grupo.add( pos4 );
	grupo.add( graf ); // quinto hijo 
	
	for( var i = 0; i < 4; i++){
	    grupo.add(tabla0[i]);
	}	

	let pas1 = grupo.clone();
	pas1.children[4].material.needsUpdate = true; // el material del nuevo clon necesita actualizarse
	pas1.position.x =  w - w*3;
	pas1.position.z = -w * 2.25;

	pas1.children[4].material = grafMaterial;  

	let pas2 = grupo.clone();
	
	pas2.position.x =  w - w*3.75;
	pas2.position.z = -w * 3;
	pas2.rotation.y = Math.PI /2;

	let pas3 = grupo.clone();

	pas3.children[4].material.needsUpdate = true; // el material del nuevo clon necesita actualizarse

	// pas2.children[4].material.map = grafTexture;  
	pas3.children[4].material = grafMaterial3;  

	pas3.position.x =  w - w*2.25;
	pas3.position.z = -w * 1.5;
	pas3.rotation.y = Math.PI /2;

	var latfoco = new THREE.Mesh( sphgeometry, sphmaterial );
	let latlightv = new THREE.PointLight(0xB80118, 3, 160);
	//0xB80118
	// 0x01B8A0
	latfoco.position.y = latlightv.position.y = 96/2 -5;
	latfoco.position.x = latlightv.position.x = 96/2;
	latfoco.position.z = latlightv.position.z = -96/4+5;

	// Pasillos lateriales 1111
	
	let pas4 = grupo.clone();

	pas4.remove(pas4.children[2]); 

	// pas4.children[2].remove();
	
	pas4.add( latlightv.clone() ); 
	pas4.add( latfoco.clone() );

	pas4.position.x =  w - w*2.25;
	pas4.position.z = -w * 0.5;
	pas4.rotation.y = Math.PI /2;
		
	let pas5 = grupo.clone();

	pas5.remove(pas5.children[2]); 

	// pas4.children[2].remove();
	
	//pas5.add( latlightv.clone() ); 
	//pas5.add( latfoco.clone() );

	pas5.position.x =  w - w*2.25;
	pas5.position.z = -w * -0.5;
	pas5.rotation.y = Math.PI /2;

	// Pasillos lateriales 2222
	
	let pas6 = grupo.clone();

	pas6.remove(pas6.children[2]); 

	// pas4.children[2].remove();
	
	//pas6.add( latlightv.clone() ); 
	//pas6.add( latfoco.clone() );

	pas6.position.x =  w + w/4;
	pas6.position.z = -w * 0.5;
	pas6.rotation.y = Math.PI /2 +Math.PI;
		
	let pas7 = grupo.clone();

	pas7.remove(pas7.children[2]); 

	// pas4.children[2].remove();
	
	pas7.add( latlightv.clone() ); 
	pas7.add( latfoco.clone() );

	pas7.position.x =  w + w/4;
	pas7.position.z = -w * -0.5;
	pas7.rotation.y = Math.PI /2+Math.PI;
	
	let pas8 = grupo.clone();

	pas8.position.x =  w - w*4.5;
	pas8.position.z = -w * 2.25;
	// pas8.rotation.y = Math.PI /2;
		
	let pas9 = grupo.clone();

	pas9.position.x =  w - w*5.25;
	pas9.position.z = -w * 3;
	pas9.rotation.y = Math.PI /2;

	let pas10 = grupo.clone();

	pas10.position.x =  w - w*6;
	pas10.position.z = -w * 3.75;
	//pas9.rotation.y = Math.PI /2;

	let pas11 = grupo.clone();

	pas11.position.x =  w - w*6.75;
	pas11.position.z = -w * 4.5;
	pas11.rotation.y = Math.PI /2;

	let pas12 = grupo.clone();

	pas12.position.x =  w - w*-0.25;
	pas12.position.z = -w * -1.5;
	pas12.rotation.y = Math.PI / 2;
	
	let pas13 = grupo.clone();

	pas13.position.x =  w - w*-1;
	pas13.position.z = -w * -2.25;
	// pas13.rotation.y = Math.PI / 2;
	
	let pas14 = grupo.clone();

	pas14.position.x =  w - w*-2.5;
	pas14.position.z = -w * -2.25;
	// pas13.rotation.y = Math.PI / 2;

	let pas15 = grupo.clone();

	pas15.position.x =  w - w*-1.75;
	pas15.position.z = -w * -3;
	pas15.rotation.y = Math.PI / 2;
	
	let pas16 = grupo.clone();

	pas16.position.x =  w - w*-3.25;
	pas16.position.z = -w * -3;
	pas16.rotation.y = Math.PI / 2;

	let pas17 = grupo.clone();

	pas17.position.x =  w - w*-4;
	pas17.position.z = -w * -3.75;
	//pas17.rotation.y = Math.PI / 2;

	
	let pas18 = grupo.clone();

	pas18.position.x =  w - w*-4.75;
	pas18.position.z = -w * -4.5;
	pas18.rotation.y = Math.PI / 2;	

	
	this.scene.add( pas1 );
	this.scene.add( pas2 );
	this.scene.add( pas3 );
	this.scene.add( pas4 );
	this.scene.add( pas5 ); 
	this.scene.add( pas6 );
	this.scene.add( pas7 ); 
	this.scene.add( pas8 );
	this.scene.add( pas9 ); 
	this.scene.add (pas10 ); 
	this.scene.add( pas11 );
	this.scene.add( pas12 );
	this.scene.add( pas13 );
	this.scene.add( pas14 );
	this.scene.add( pas15 );
	this.scene.add( pas16 ); 
	this.scene.add( pas17 );
	this.scene.add( pas18 ); 
	
    },

    rotaciones: function(){

	// var time = Date.now() * 0.0005;

	// vuelta6.children[].color.setHex( 0xB80118 );

	// 17 para los flyers
	// Cada vuelta tiene un número distinto
	
	edges.vuelta1.children[18].rotation.x += 0.005;
	edges.vuelta1.children[18].rotation.y += 0.006;
	edges.vuelta1.children[18].rotation.z += 0.007;

	edges.vuelta2.children[17].rotation.x += 0.007;
	edges.vuelta2.children[17].rotation.y += 0.006;
	edges.vuelta2.children[17].rotation.z += 0.005;
	
	edges.vuelta3.children[18].rotation.x += 0.006;
	edges.vuelta3.children[18].rotation.y += 0.007;
	edges.vuelta3.children[18].rotation.z += 0.005;
	
	edges.vuelta4.children[18].rotation.x += 0.005;
	edges.vuelta4.children[18].rotation.y += 0.007;
	edges.vuelta4.children[18].rotation.z += 0.006;

	
    },

    addMaze: function(){

	var width = 96; // esto sería x en dos dimensiones 
	var height = 54; // esto solo es la altura
	
	var geometry = new THREE.PlaneGeometry( width, height, 32 );

	/*
	for (let i = 0; i < geometry.vertices.length; i++) {
	    geometry.vertices[i].z += (Math.random()*16)-8;
	}
	*/
	
	//var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );

	this.screenTexture = new THREE.VideoTexture(  document.getElementById( 'streaming-video' ) );
		
	this.screenMaterial = new THREE.MeshBasicMaterial({
	    color: 0xffffff,
	    //metalness: 0.6,
	    //roughness: 0.7, 
            map: this.screenTexture,
            side: THREE.DoubleSide,
            //castShadow: false,
            //receiveShadow: false
	});

	var plane = new THREE.Mesh( geometry, this.screenMaterial );

	plane.position.y = height/2;
	plane.position.z = width; 
	this.scene.add( plane );
	
	var plane2 = new THREE.Mesh( geometry, this.screenMaterial );

	plane2.position.y = height/2;
	plane2.position.z = -width;
	//plane2.rotation.y = Math.PI /2; 
	this.scene.add( plane2 );
	
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
                      
            let sphRotation = setInterval(function(){
     
                sphere.rotation.y += 0.001;
                sphere.rotation.z += 0.001;
     
            }, 30)


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
	
	let avbodyMaterial = new THREE.MeshStandardMaterial( {
	    color: 0xffffff,
	    metalness: 0.5,
	    roughness: 0.65,
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

	/*
	edges.light1.position.x = Math.sin( time * 0.7 ) * 20;
	edges.light1.position.y = 10 +Math.cos( time * 0.5 ) * 80+10;
	edges.light1.position.z = Math.cos( time * 0.3 ) * 60;
	
	edges.light2.position.x = Math.cos( time * 0.3 ) * 260;
	edges.light2.position.y = 10+Math.sin( time * 0.5 ) * 80 + 10;
	edges.light2.position.z = Math.sin( time * 0.7 ) * 60;

	edges.light3.position.x = Math.sin( time * 0.7 ) * 230;
	edges.light3.position.y = 10+Math.cos( time * 0.3 ) * 40 + 10;
	edges.light3.position.z = Math.sin( time * 0.5 ) * 30;
	
	edges.light4.position.x = Math.sin( time * 0.3 ) * 230;
	edges.light4.position.y = 10+Math.cos( time * 0.7 ) * 40 + 10;
	edges.light4.position.z = Math.sin( time * 0.5 ) * 30;
	*/
	
        // City lights
	/*
	edges.clight1.position.x = Math.sin( time * 0.7/2 ) * 20;
	edges.clight1.position.y = 10 +Math.cos( time * 0.5/2 ) * 50;
	edges.clight1.position.z = Math.cos( time * 0.3/2 );
	
        edges.clight2.position.x = Math.cos( time * 0.3/2 ) * 400;
        edges.clight2.position.y = 10+Math.sin( time * 0.5/2 ) * 50;
	edges.clight2.position.z = Math.sin( time * 0.7/2 );
	
	edges.clight3.position.x = Math.cos( time * 0.7/2 ) * 400;
	edges.clight3.position.y = 10+Math.cos( time * 0.3/2 ) * 50;
	edges.clight3.position.z = Math.sin( time * 0.5/2 );
	
	edges.clight4.position.x = Math.sin( time * 0.3/2 ) * 400;
	edges.clight4.position.y = 10+Math.cos( time * 0.7/2 ) * 50;
	edges.clight4.position.z = Math.sin( time * 0.5/2 );

*/
	},

	/*
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

	}, */
	animate: function(){
		requestAnimationFrame( edges.animate );
		edges.renderer.render(edges.scene, edges.camera);
		if (edges.streamingAudio) edges.moveAudioSphere()
	    // edges.moveLight();
	    //edges.rotaciones(); 
	//	if(edges.controls.controls.isLocked) edges.controls.move()
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
	streamingAudio: false
};

let ctrl = false
/*
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
                case 84:
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
*/

function onWindowResize() {
	edges.camera.aspect = window.innerWidth / window.innerHeight
	edges.camera.updateProjectionMatrix()
	edges.renderer.setSize(window.innerWidth, window.innerHeight)
}

function onLoadMedia(){

	let audio = new Audio('edges.piranhalab.cc/audio');
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
/*
function onLock(){
	document.querySelector("#instructions").style.display = "none";
	document.querySelector("#blocker").style.display = "none";
	if(onLoadMedia){
		onLoadMedia()
		onLoadMedia = null
	}
}

function onUnlock(){
		document.querySelector("#instructions").style.display = "";
		document.querySelector("#blocker").style.display = "";
}
*/
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
window.edges = edges;
window.Users = Users;
window.flvPlayer = flvPlayer;
window.personajes = personajes;
window.onLoadMedia = onLoadMedia

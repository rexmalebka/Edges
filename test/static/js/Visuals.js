import * as THREE from './three/build/three.module.js';
import {PointerLockControls} from './three/examples/jsm/controls/PointerLockControls.js'

export const Visuals = {
        init: function(){
                this.initScene();
		this.addControls();
                this.addFloor();
                this.animate();
		window.addEventListener('addUser', function(e){
			Visuals.addUser(e);
		})
		window.addEventListener('move', function(e){
			Visuals.moveUser(e);
		});
		window.addEventListener('removeUser', function(e){
			Visuals.removeUser(e);
		});
		window.addEventListener('renameUser', function(e){
			Visuals.renameUser(e);
		});

        },
	initScene: function(){
		let scene = new THREE.Scene();
		let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

		camera.position.set(0,2,-5);

		let renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight )

		this.camera = camera;
		this.renderer = renderer;
		this.scene = scene;
		
		document.body.appendChild( renderer.domElement );
                window.addEventListener( 'resize', function(){
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight )
		});
	},
	addFloor: function(){
		let geometry = new THREE.PlaneBufferGeometry( 200, 200, 32 );
		let material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
		let plane = new THREE.Mesh( geometry, material );
		plane.rotateX(Math.PI/2)
		
		this.scene.add( plane );
	},
	addControls: function(){
                let controls = new PointerLockControls( this.camera, document.body );
		let camera = this.camera;
                document.body.addEventListener( 'click', (event)=>{
			if(document.activeElement == document.body){
				controls.moveForward(0.001);
				controls.moveRight(0.001);
				controls.lock()
			}
                });
                document.body.addEventListener( 'keydown', function(event){
			switch(event.key){
				case 'w':
					controls.moveForward(0.5)
					Users.me.position.x = camera.position.x;
					Users.me.position.y = camera.position.y;
					Users.me.position.z = camera.position.z;
					dispatchEvent(Users.me.moveForward)
					break;
				case 's':
					controls.moveForward(-0.5);
					Users.me.position.x = camera.position.x;
					Users.me.position.y = camera.position.y;
					Users.me.position.z = camera.position.z;
					dispatchEvent(Users.me.moveForward)
					break;
				case 'a':
					controls.moveRight(-0.5)
					Users.me.position.x = camera.position.x;
					Users.me.position.y = camera.position.y;
					Users.me.position.z = camera.position.z;
					dispatchEvent(Users.me.moveForward)
					break;
				case 'd':
					controls.moveRight(0.5)
					Users.me.position.x = camera.position.x;
					Users.me.position.y = camera.position.y;
					Users.me.position.z = camera.position.z;
					dispatchEvent(Users.me.moveForward)
					break;
			}
		});
	},


	addUser: function(e){
		const uuid = e.detail.uuid;
		const user = Users[uuid == Users.me.uuid ? 'me' : uuid]
		const position = user.position;

		let geom = new THREE.SphereGeometry( 0.2, 32, 32 );
		let mat = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		let sphere = new THREE.Mesh( geom, mat );

		sphere.position.set(position.x, 2, position.z);
		
		user.position.x = Visuals.camera.position.x
		user.position.y = Visuals.camera.position.y
		user.position.z = Visuals.camera.position.z

		let canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 64;
		let ctx = canvas.getContext('2d');
		ctx.font = "50px Arial"
		ctx.fillStyle = "red"
		ctx.fillText(user.nickname, 10, 40);
		
		const texture = new THREE.CanvasTexture(canvas);
		let mat2 = new THREE.MeshBasicMaterial({ map: texture , side: THREE.DoubleSide});
		//let geom2 = new THREE.BoxGeometry( 0.1, 2, 4 );
		let geom2 = new THREE.PlaneBufferGeometry( 2, 4, 32 );
		let label = new THREE.Mesh( geom2, mat2 );
		
		label.position.set(position.x, 2, position.z);

		Visuals.users[uuid] = sphere;
		Visuals.userlabels[uuid] = label;
		Visuals.scene.add( sphere );
		Visuals.scene.add( label );
	},
	renameUser: function(e){
		const uuid = e.detail.uuid;
		const user = Users[uuid == Users.me.uuid ? 'me' : uuid]
		const position = user.position;
		
		let canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 100;
		let ctx = canvas.getContext('2d');
		ctx.font = "50px Arial"
		ctx.fillStyle = "red"
		ctx.fillText(user.nickname, 10, 40);
		
		const texture = new THREE.CanvasTexture(canvas);
		let mat2 = new THREE.MeshBasicMaterial({ map: texture });
		let geom2 = new THREE.BoxGeometry( 0.1, 2, 4 );
		let label = new THREE.Mesh( geom2, mat2 );
		
		label.position.set(position.x, 4, position.z);
		
		let meshlabel = Visuals.userlabels[uuid];

		meshlabel.geometry.dispose();
		meshlabel.material.dispose();
		Visuals.scene.remove(meshlabel);
		Visuals.renderer.renderLists.dispose();
		
		Visuals.userlabels[uuid] = label;
		Visuals.scene.add( label );

	},
	moveUser: function(e){

		const uuid = e.detail.uuid;
		const position = Users[uuid == Users.me.uuid ? 'me' : uuid].position;
		let sphere = Visuals.users[uuid];
		let label = Visuals.userlabels[uuid];

		sphere.position.set(position.x, 2, position.z);
		label.position.set(position.x, 4, position.z);
	},
	removeUser: function(e){
		const uuid = e.detail.uuid;
		let mesh = Visuals.users[uuid];
		let meshlabel = Visuals.userlabels[uuid];


		mesh.geometry.dispose();
		mesh.material.dispose();
		Visuals.scene.remove(mesh);
		Visuals.renderer.renderLists.dispose();
		
		meshlabel.geometry.dispose();
		meshlabel.material.dispose();
		Visuals.scene.remove(meshlabel);
		Visuals.renderer.renderLists.dispose();
	},


	animate: function(){
		let renderer = this.renderer;
		let scene = this.scene;
		let camera = this.camera;
		function animate() {
			requestAnimationFrame( animate );
			renderer.render( scene, camera );
		}
		animate();
	},
	users: {},
	userlabels:{}
}

window.Visuals = Visuals

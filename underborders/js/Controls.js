import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from '/js/three/build/three.module.js';
import {Debug, Bounds, stairs, antistairs} from '/js/Bounds.js';
import { GLTFLoader } from '/js/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '/js/three/examples/jsm/loaders/DRACOLoader.js';

function checkBoundaries(position){
	let insides = controls.bounds.map((box)=>{
		box.geometry.computeBoundingBox();

		var boxMatrixInverse = new THREE.Matrix4().getInverse(box.matrixWorld);

		var inverseBox = box.clone();
		var inversePoint = position.clone();

		inverseBox.applyMatrix4(boxMatrixInverse);
		inversePoint.applyMatrix4(boxMatrixInverse);

		var bb = new THREE.Box3().setFromObject(inverseBox);
		var isInside = bb.containsPoint(inversePoint);
		return isInside
	})
	return !insides.some(x=>x)
}

function checkStairs(position){
	let insides = controls.stairs.map((box)=>{
		box.geometry.computeBoundingBox();

		var boxMatrixInverse = new THREE.Matrix4().getInverse(box.matrixWorld);

		var inverseBox = box.clone();
		var inversePoint = position.clone();

		inverseBox.applyMatrix4(boxMatrixInverse);
		inversePoint.applyMatrix4(boxMatrixInverse);

		var bb = new THREE.Box3().setFromObject(inverseBox);
		var isInside = bb.containsPoint(inversePoint);
		return isInside
	})
	return insides.some(x=>x)

}

function checkAntistairs(position){
	let insides = controls.antistairs.map((box)=>{
		box.geometry.computeBoundingBox();

		var boxMatrixInverse = new THREE.Matrix4().getInverse(box.matrixWorld);

		var inverseBox = box.clone();
		var inversePoint = position.clone();

		inverseBox.applyMatrix4(boxMatrixInverse);
		inversePoint.applyMatrix4(boxMatrixInverse);

		var bb = new THREE.Box3().setFromObject(inverseBox);
		var isInside = bb.containsPoint(inversePoint);
		return isInside
	})
	return insides.some(x=>x)

}

function checkTeleport(position){
	let insides = controls.teleport.map((box)=>{
		box.geometry.computeBoundingBox();

		var boxMatrixInverse = new THREE.Matrix4().getInverse(box.matrixWorld);

		var inverseBox = box.clone();
		var inversePoint = position.clone();

		inverseBox.applyMatrix4(boxMatrixInverse);
		inversePoint.applyMatrix4(boxMatrixInverse);

		var bb = new THREE.Box3().setFromObject(inverseBox);
		var isInside = bb.containsPoint(inversePoint);
		return isInside
	})
	return insides.some(x=>x)

}

export const controls = {
	init: function(camera){
		this.controls = new PointerLockControls(camera, document.body)
		this.controls.addEventListener('lock', this.onLock )
                this.controls.addEventListener('unlock', this.onUnlock )
		this.raycaster = new THREE.Raycaster();
		this.initPos = camera.position.clone()
		this.raycaster.setFromCamera( camera.position.clone(), camera );

		this.dist = 14
		let callback = function(){
			requestAnimationFrame(callback);
			if(controls.controls.isLocked) controls.move()
		}

		document.querySelector("#instructions").addEventListener('click', ()=> controls.controls.lock())
		window.addEventListener('blur', function(e){
			if(!controls.controls.isLocked) return
			document.querySelector("#chat").style.display = 'none'
			document.querySelector("#instructions").style.display = "block";
			document.querySelector("#blocker").style.display = "";
		})
		document.addEventListener("click",function(){
			if(controls.controls.isLocked){
				Chat.blur()
			}
		})

		controls.prevTime = performance.now()
		requestAnimationFrame(callback);
		setTimeout(this.debug,2000)
		setTimeout(this.addRoot,2000)

		this.bounds = Bounds
		this.stairs = stairs
		this.antistairs = antistairs
		return this
	},
	debug: function(){
		if(Debug){
			console.debug("debugging boundaries")
			window.THREE = THREE
			Bounds.forEach(bound=>{
				edges.scene.add(bound)
			})
			stairs.forEach(bound=>{
				edges.scene.add(bound)
			})
			antistairs.forEach(bound=>{
				edges.scene.add(bound)
			})
		}
	},
	addRoot: function(){
		let loader = new GLTFLoader();
		var dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath( '/js/three/examples/js/libs/draco/' );
		loader.setDRACOLoader( dracoLoader );
		loader.load(
			'/models/dino.glb',
			function(gltf){
				let roots = gltf.scene
				var mat = new THREE.MeshBasicMaterial( {color: 0xffff00,side:THREE.DoubleSide} );
				roots.scale.multiplyScalar(100)

				//roots.children[0].material = mat
				edges.roots = roots
				
				console.debug(roots,"roots")
				edges.scene.add(roots)
			}
		)

		let rooms = [45,45,40,-595.2,20,-504]
		var mat = new THREE.MeshBasicMaterial( {color: 0xffffff,side:THREE.DoubleSide} );
		let geom = new THREE.BoxBufferGeometry(1,1,1)
		let mesh = new THREE.Mesh(geom, mat)

		edges.teleport = mesh
		mesh.scale.set(rooms[0], rooms[1], rooms[2] );
		mesh.position.x=rooms[3]
		mesh.position.y=rooms[4]
		mesh.position.z=rooms[5]
		
		let mesh2 = mesh.clone();

		mesh2.position.set(596, 21, 504)


		controls.teleport = [mesh, mesh2]
		edges.scene.add(mesh)
		edges.scene.add(mesh2)

		let text = new THREE.TextureLoader().load( "/img/fabrica1.jpg")
		let text2 = new THREE.TextureLoader().load( "/img/fabrica2.jpg")

		var postermat = new THREE.MeshBasicMaterial( {map:text,side:THREE.DoubleSide} );
		let postergeom = new THREE.PlaneBufferGeometry(29.375,24.3125,10,10)

		let postermesh = new THREE.Mesh(postergeom, postermat)
		postermesh.position.set(-572.2,21,-504)
		postermesh.rotation.set(0, Math.PI/2,0)
		edges.poster = postermesh


		
		var postermat2 = new THREE.MeshBasicMaterial( {map:text2, side:THREE.DoubleSide} );
		let postergeom2 = new THREE.PlaneBufferGeometry(27.6,39.6,10,10)

		let postermesh2 = new THREE.Mesh(postergeom2, postermat2)
		postermesh2.position.set(572.22, 22, 504)
		postermesh2.rotation.set(0, -Math.PI/2,0)
		edges.poster2 = postermesh2


		edges.scene.add(postermesh)
		edges.scene.add(postermesh2)

	},
	move: function(){
		const delta = 0.0215
		//const time = performance.now()
		//const delta = ( time - controls.prevTime ) / 4000;


                controls.velocity.x -= controls.velocity.x * 10.0 * delta
                controls.velocity.z -= controls.velocity.z * 10.0 * delta
                controls.velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass

                controls.direction.z = Number(controls.moveForward) - Number(controls.moveBackward)
                controls.direction.x = Number(controls.moveRight) - Number(controls.moveLeft)

                controls.direction.normalize()

                if (controls.moveForward || controls.moveBackward || controls.moveLeft || controls.moveRight) {
                if (controls.moveForward || controls.moveBackward) {
                        controls.velocity.z -= controls.direction.z * 400.0 * delta
                }
                if (controls.moveLeft || controls.moveRight) {
                        controls.velocity.x -= controls.direction.x * 400.0 * delta
                }
                controls.controls.moveRight(-controls.velocity.x * delta)
                controls.controls.moveForward(-controls.velocity.z * delta)

			// 0, 14 -200
			//
			
		console.debug(checkStairs(edges.camera.position))
		if(checkStairs(edges.camera.position)){
			// trying to go up on stair
			let dx = 0.1
			if(controls.moveForward){
				edges.camera.position.y -= (controls.velocity.z) * dx
			}
			if(controls.moveBackward){
				edges.camera.position.y += (controls.velocity.z) * dx
			}
		}
		
		if(checkAntistairs(edges.camera.position)){
			// trying to go up on stair
			let dx = 0.1

			//edges.camera.position.y += (controls.velocity.z) * dx
			//edges.camera.position.y = Math.max(edges.camera.position.y,14)
			
			if(controls.moveForward){
				edges.camera.position.y += (controls.velocity.z) * dx
			}
			if(controls.moveBackward){
				edges.camera.position.y -= (controls.velocity.z) * dx
			}
		}
		if(checkTeleport(edges.camera.position)){
			setTimeout(function(){
				let a = document.createElement("a")
				a.href = "https://hubs.mozilla.com/ZFT7uMn/maquinaturalis-fabricavr";
				a.click()
			},1500)
		}
		if(edges.camera.position.y>60){
			edges.camera.position.y = 60
		}
			
		if(edges.camera.position.y<14){
			edges.camera.position.y = 14
		}

		if(!checkBoundaries(edges.camera.position) ){
			controls.controls.moveRight(controls.velocity.x * delta)
			controls.controls.moveForward(controls.velocity.z * delta)
			return 
		}
                        const camPos = edges.camera.position
                        Users.me.position.x = camPos.x
                        Users.me.position.y = camPos.y
                        Users.me.position.z = camPos.z

                    const rotPos = edges.camera.rotation
                    //Users.me.rotation.x = rotPos.x
                    Users.me.rotation.y = rotPos.y
                    //Users.me.rotation.z = rotPos.z

                        personajes.me.position.x = camPos.x
                        personajes.me.position.y = camPos.y 
                        personajes.me.position.z = camPos.z
                        if(!controls.moving){
                                this.stoping = false
                                controls.moving = setInterval(function(){
                                    Users.me.move();
                                    Users.me.rotate();
                                },400)
                        }
                }else{
                        clearInterval(controls.moving)
                        if(!this.stoping && controls.moving){
                                this.stoping = true
                            Users.me.move()
                            Users.me.rotate()
                        }
                        controls.moving = false

                }
		//controls.prevTime = time
        },
	onLock: function(){
		document.querySelector("#instructions").style.display = "none";
		document.querySelector("#blocker").style.display = "none";
		if(onLoadMedia){
			onLoadMedia()
			onLoadMedia = null
		}
	},
	onUnlock: function(){
                document.querySelector("#instructions").style.display = "";
                document.querySelector("#blocker").style.display = "";
	},

	velocity: new THREE.Vector3(),
        direction: new THREE.Vector3(),
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        canJump: false,
        moving: false,
        stoping: false,
	bounds: [],
}

function onKeyDown(event) {
        switch (event.keyCode) {
                case 38: // up
                case 87: // w
                        if(document.activeElement == document.body) controls.moveForward = true
                        break

                case 37: // left
                case 65: // a
                        if(document.activeElement == document.body) controls.moveLeft = true
                        break

                case 40: // down
                case 83: // s
                        if(document.activeElement == document.body) controls.moveBackward = true
                        break
                case 39: // right
                case 68: // d
                        if(document.activeElement == document.body) controls.moveRight = true
                        break
                case 32: // space
                        if (controls.canJump === true) // velocity.y += 350
                        { controls.canJump = false }
                        break
        }
}

function onKeyUp (event) {
        switch (event.keyCode) {
                case 38: // up
                case 87: // w
                        if(document.activeElement == document.body) controls.moveForward = false
                        break
                case 37: // left
                case 65: // a
                        if(document.activeElement == document.body) controls.moveLeft = false
                        break

                case 40: // down
                case 83: // s
                        if(document.activeElement == document.body) controls.moveBackward = false
                        break

                case 39: // right
                case 68: // d
                        if(document.activeElement == document.body) controls.moveRight = false
                        break
                case 84:
                        if(document.activeElement != document.querySelector("#usuarix")){
                                document.querySelector("#chat").style.display = ''
                                document.querySelector('#inputMensaje').focus()
                                controls.moveForward = false
                                controls.moveLeft = false
                                controls.moveBackward = false
                                controls.moveRight = false
                        }
                        break

        }
}

document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)
document.querySelector('#quality').addEventListener('change', function(e){
	switch(e.target.value){
		case "100%":
			edges.renderer.setPixelRatio(1)
			break;
		case "75%":
			edges.renderer.setPixelRatio(0.75)
			break;
		case "50%":
			edges.renderer.setPixelRatio(0.5)
			break;
		case "25%":
			edges.renderer.setPixelRatio(0.25)
			break;

	}
//	edges.camera.aspect = window.innerWidth / window.innerHeight
//	edges.camera.updateProjectionMatrix()
//	edges.renderer.setSize(window.innerWidth, window.innerHeight)
})

import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from '/js/three/build/three.module.js';
import {Debug, Bounds, stairs, antistairs} from '/js/Bounds.js';

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

		requestAnimationFrame(callback);
		setTimeout(this.debug,2000)

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
	move: function(){
                const delta = 0.015


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



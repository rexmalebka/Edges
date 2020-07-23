import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from '/js/three/build/three.module.js';

console.debug("hola -----")
export const controls = {
	init: function(camera){
		this.controls = new PointerLockControls(camera, document.body)
		this.controls.addEventListener('lock', this.onLock )
                this.controls.addEventListener('unlock', this.onUnlock )


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

		return this
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
                if (controls.moveForward || controls.moveBackward) {
                        controls.velocity.z -= controls.direction.z * 400.0 * delta
                }
                if (controls.moveLeft || controls.moveRight) {
                        controls.velocity.x -= controls.direction.x * 400.0 * delta
                }
                controls.controls.moveRight(-controls.velocity.x * delta)
                controls.controls.moveForward(-controls.velocity.z * delta)

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
        canJumpt: false,
        moving: false,
        stoping: false,
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



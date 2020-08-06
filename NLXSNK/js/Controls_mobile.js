import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from '/js/three/build/three.module.js';

export const controls = {
	init: function(camera){
		this.controls = new PointerLockControls(camera, document.body)
		this.camera = camera
		let divControls = document.createElement('div');
		divControls.id = "controls"

		document.querySelector("#chat").style.right = "15%"

		let moveControls = document.createElement('div');
		let cameraControls = document.createElement('div');

		let divbutton;
		let upButton, rightButton,leftButton, downButton;

		upButton = document.createElement('button');
		downButton = document.createElement('button');
		leftButton = document.createElement('button');
		rightButton = document.createElement('button');
		
		upButton.classList.add('widebutton')
		downButton.classList.add('widebutton')

		upButton.id = 'upButton'
		leftButton.id = 'leftButton'
		rightButton.id = 'rightButton'
		downButton.id = 'downButton'


		upButton.addEventListener('touchstart', function(e){
			move(e)
		})
		upButton.addEventListener('touchend', function(e){
			stopp(e)
		})
		upButton.addEventListener('touchcancel', function(e){
			stopp(e)
		})

		leftButton.addEventListener('touchstart', function(e){
			move(e)
		})
		leftButton.addEventListener('touchend', function(e){
			stopp(e)
		})
		leftButton.addEventListener('touchcancel', function(e){
			stopp(e)
		})
		

		rightButton.addEventListener('touchstart', function(e){
			move(e)
		})
		rightButton.addEventListener('touchend', function(e){
			stopp(e)
		})
		rightButton.addEventListener('touchcancel', function(e){
			stopp(e)
		})
		
		downButton.addEventListener('touchstart', function(e){
			move(e)
		})
		downButton.addEventListener('touchend', function(e){
			stopp(e)
		})
		downButton.addEventListener('touchcancel', function(e){
			stopp(e)
		})

		moveControls.id = 'moveControls'
		cameraControls.id = 'cameraControls'

		upButton.textContent = '↑'
		leftButton.textContent = '←'
		rightButton.textContent = '→ '
		downButton.textContent = '↓'
		
		divbutton = document.createElement('div');
		let cUp = upButton.cloneNode(true)
		cUp.addEventListener('touchstart', function(e){
			move(e)
		})
		cUp.addEventListener('touchend', function(e){
			stopp(e)
		})
		cUp.addEventListener('touchcancel', function(e){
			stopp(e)
		})
		
		divbutton.appendChild(cUp)
		moveControls.appendChild(divbutton)
		
		divbutton = document.createElement('div');
		let cLeft = leftButton.cloneNode(true)
		cLeft.addEventListener('touchstart', function(e){
			move(e)
		})
		cLeft.addEventListener('touchend', function(e){
			stopp(e)
		})
		cLeft.addEventListener('touchcancel', function(e){
			stopp(e)
		})
		let cRight = rightButton.cloneNode(true)
		cRight.addEventListener('touchstart', function(e){
			move(e)
		})
		cRight.addEventListener('touchend', function(e){
			stopp(e)
		})
		cRight.addEventListener('touchcancel', function(e){
			stopp(e)
		})
		divbutton.appendChild(cLeft)
		divbutton.appendChild(cRight)
		
		moveControls.appendChild(divbutton)

		divbutton = document.createElement('div');
		let cDown = downButton.cloneNode(true)
		cDown.addEventListener('touchstart', function(e){
			move(e)
		})
		cDown.addEventListener('touchend', function(e){
			stopp(e)
		})
		cDown.addEventListener('touchcancel', function(e){
			stopp(e)
		})
		divbutton.appendChild(cDown)
		moveControls.appendChild(divbutton)

		/////////

		divbutton = document.createElement('div');
		divbutton.appendChild(upButton)
		cameraControls.appendChild(divbutton)
		
		divbutton = document.createElement('div');
		divbutton.appendChild(leftButton)
		divbutton.appendChild(rightButton)
		cameraControls.appendChild(divbutton)

		divbutton = document.createElement('div');
		divbutton.appendChild(downButton)
		cameraControls.appendChild(divbutton)

		divControls.appendChild(moveControls)
		divControls.appendChild(cameraControls)

		document.body.appendChild(divControls)


		// boton de instrucciones 
		
		let mostrarinstButton = document.createElement('button')

		mostrarinstButton.id = 'mostrarinfo';
		mostrarinstButton.style.border = "2px white solid"
		mostrarinstButton.textContent = 'ⓘ'

		mostrarinstButton.addEventListener('click', function(e){
			controls.mostrar(e)
		})
		document.querySelector('#texturasform').insertAdjacentElement('afterend',mostrarinstButton)

		let callback = function(){
			requestAnimationFrame(callback);
			controls.move()
			controls.rotate()
		}

		requestAnimationFrame(callback);
		return this
	},
	mostrar: function(e){
		e.preventDefault()

		if(onLoadMedia){
                        onLoadMedia()
                        onLoadMedia = null
                }

		document.querySelector('#instructions').style.display = (document.querySelector('#instructions').style.display == ''? 'none' : '')
		if(document.querySelector('#instructions').style.display == ''){
			document.querySelector('#moveControls').style.zIndex = -1 
			document.querySelector('#cameraControls').style.zIndex = -1

			document.querySelector('#moveControls').style.opacity = 0.25
			document.querySelector('#cameraControls').style.opacity = 0.25
		}else{
			document.querySelector('#moveControls').style.zIndex = 0
			document.querySelector('#cameraControls').style.zIndex = 0		
			
			document.querySelector('#moveControls').style.opacity = 1
			document.querySelector('#cameraControls').style.opacity = 1
		}
		document.body.requestFullscreen().catch((error)=>{
			console.debug(error,"errooooor")
		})
	},
	rotate: function(){
		controls.controls.getObject().rotation.order = 'YXZ'
		controls.controls.getObject().rotateY(controls.rotateY * 1e-2)
		controls.controls.getObject().rotateX(controls.rotateX * 1e-2)
		controls.controls.getObject().rotation.z = 0
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
	rotateX: 0,
	rotateY: 0
}
	
function move(e){
	e.preventDefault()
	if(e.target.parentNode.parentNode == document.querySelector("#moveControls")){
		switch(e.target.id){
			case 'upButton':
				controls.moveForward = true
				break;
			case 'leftButton':
				controls.moveLeft = true
				break;
			case 'rightButton':
				controls.moveRight= true
				break
			case 'downButton':
				controls.moveBackward = true
				break
		}
	}else if(e.target.parentNode.parentNode == document.querySelector("#cameraControls")){
		switch(e.target.id){
			case 'upButton':
				controls.rotateX = 1
				break;
			case 'leftButton':
				controls.rotateY = 1
				break;
			case 'rightButton':
				controls.rotateY = -1
				break
			case 'downButton':
				controls.rotateX = -1
				break
		}
	}
}
	
function stopp(e){
	e.preventDefault()
	if(e.target.parentNode.parentNode == document.querySelector("#moveControls")){
		switch(e.target.id){
			case 'upButton':
				controls.moveForward = false
				break;
			case 'leftButton':
				controls.moveLeft = false
				break;
			case 'rightButton':
				controls.moveRight= false
				break
			case 'downButton':
				controls.moveBackward = false
				break
		}
	}else{
		switch(e.target.id){
			case 'upButton':
				controls.rotateX = 0
				break;
			case 'leftButton':
				controls.rotateY = 0
				break;
			case 'rightButton':
				controls.rotateY = 0
				break
			case 'downButton':
				controls.rotateX = 0
				break
		}
	}
}

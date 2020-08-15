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
		let mostrardiv = document.createElement('div')

		mostrarinstButton.id = 'mostrarinfo';
		mostrarinstButton.style.border = "2px white solid"
		mostrarinstButton.textContent = 'ⓘ'

		mostrarinstButton.addEventListener('click', function(e){
			controls.mostrar(e)
		})

		mostrardiv.appendChild(mostrarinstButton)
	
		document.querySelector('#query').appendChild(mostrardiv)

		let callback = function(){
			requestAnimationFrame(callback);
			controls.move()
			controls.rotate()
		}
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
                const delta = 0.0215

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
			                if(edges.camera.position.y<22){
                        edges.camera.position.y = 22
                }

                if(!checkBoundaries(edges.camera.position) ){
                        controls.controls.moveRight(controls.velocity.x * delta)
                        controls.controls.moveForward(controls.velocity.z * delta)
                        return
                }



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

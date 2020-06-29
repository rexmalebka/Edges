localStorage.removeItem('uuid')
let raycaster

let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let canJump = false

let moving = false;
let stoping = false

let prevTime = performance.now()
let velocity = new THREE.Vector3()
let direction = new THREE.Vector3()
let vertex = new THREE.Vector3()
let color = new THREE.Color()

const cambiarNombrebutton = document.querySelector("#cambiarNombre");
const mostrarChatbutton = document.querySelector("#mostrarChat");
const chatContainer = document.querySelector("#chat")
const inputMensaje = document.querySelector("#inputMensaje")
const mandarMensajebutton = document.querySelector("#mandarMensaje")
const query = document.getElementById('query')
const usuarix = document.querySelector('#usuarix')
const mostrarUsuarix = document.querySelector('#mostrarUsuarix')
const contacto = document.querySelector('#contacto')

init()
animate()
Server.init();

function init () {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.y = -400

  scene = new THREE.Scene()
  this.scene.background = new THREE.CubeTextureLoader().setPath('/img/').load([
    'px2.png',
    'nx2.png',
    'py2.png',
    'ny2.png',
    'pz2.png',
    'nz2.png'
  ])

 scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.25)
  light.position.set(0.5, 1, 0.75)
  scene.add(light)

  controls = new THREE.PointerLockControls(camera, document.body)

  let blocker = document.getElementById('blocker')
  let instructions = document.getElementById('instructions')
  let distopia = document.getElementById('distopia')

if(usuarix.value.length>0){
	cambiarNombrebutton.disabled = false
	mostrarUsuarix.textContent = usuarix.value
}

  controls.addEventListener('lock', function () {
    instructions.style.display = 'none'
  })

  controls.addEventListener('unlock', function () {
    instructions.style.display = ''
  })

  scene.add(controls.getObject())

  let onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true
      break

      case 37: // left
      case 65: // a
        moveLeft = true
        break

      case 40: // down
      case 83: // s
        moveBackward = true
        break

      case 39: // right
      case 68: // d
        moveRight = true
        break

      case 32: // space
        if (canJump === true) //velocity.y += 350
        canJump = false
        break
    }
  }

  let onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false
      //Users.me.stop('f')
        break

      case 37: // left
      case 65: // a
        moveLeft = false
      //Users.me.stop('l')
        break

      case 40: // down
      case 83: // s
        moveBackward = false
      //Users.me.stop('f')
        break

      case 39: // right
      case 68: // d
        moveRight = false
      //Users.me.stop('l')
        break
    }
  }

  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)

			    // lights

			    light1 = new THREE.PointLight(0x50b732, 6, 150)
			    scene.add(this.light1)
			    light2 = new THREE.PointLight(0x3b5fd1, 6, 150)
			    scene.add(this.light2)
			    light3 = new THREE.PointLight(0xde3fe1, 6, 150)
			    scene.add(this.light3)
			    light4 = new THREE.PointLight(0x7930a7, 6, 150)
			    scene.add(this.light4)

			    // let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

			    let sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: scene.background,
    refractionRatio: 0.75
			    })

			    let sphereGeometry = new THREE.BoxGeometry(20, 20, 20)

			    let cube = []
			    // Objs

			    for (let i = 0; i < 100; i++) {
    cube[i] = new THREE.Mesh(sphereGeometry, sphereMaterial)

    cube[i].position.x = Math.random() * 400 - 200
    // cube[i].position.y = Math.random() * 400 -200;
    cube[i].position.z = Math.random() * 400 - 200

    let tam = Math.random() * 100

    cube[i].scale.x = 0.1
    cube[i].scale.y = tam

    cube[i].scale.z = 0.1

    scene.add(cube[i])
			    }

			    // let geometry = new THREE.BoxGeometry();
			    let geometryCli = new THREE.CylinderBufferGeometry(100, 100, 10, 64)

			    geometryCli.computeVertexNormals()

			    let cilMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: scene.background,
    refractionRatio: 0.75
			    })

			    cil1 = new THREE.Mesh(geometryCli, cilMaterial)
			    scene.add(cil1)

			    // floor

			    let floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100)
			    floorGeometry.rotateX(-Math.PI / 2)

			    // let texture = new THREE.TextureLoader().load( 'img/texture.jpg' );

			    // texture.wrapS = THREE.RepeatWrapping;
			    // texture.wrapT = THREE.RepeatWrapping;

			    let loader = new THREE.TextureLoader()

			    let texture = loader.load('img/texture.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.offset.set(0, 0)
    texture.repeat.set(15, 15)
			    })

  // your code

			    let floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.4,
    roughness: 0.7,
    map: texture
    // transparent: true,
    // opacity: 0.75,
			    })

			    // let floorMaterial = new THREE.MeshBasicMaterial( { map: texture } );

			    let floor = new THREE.Mesh(floorGeometry, floorMaterial)
			    scene.add(floor)

  //

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.querySelector("#distopia").appendChild(renderer.domElement)

  //

  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)

  let time = Date.now() * 0.0005

  light1.position.x = Math.sin(time * 0.7) * 60
  light1.position.y = 50 + Math.cos(time * 0.5) * 80
  light1.position.z = Math.cos(time * 0.3) * 60

  light2.position.x = Math.cos(time * 0.3) * 60
  light2.position.y = 50 + Math.sin(time * 0.5) * 80
  light2.position.z = Math.sin(time * 0.7) * 60

  light3.position.x = Math.sin(time * 0.7) * 30
  light3.position.y = 50 + Math.cos(time * 0.3) * 40
  light3.position.z = Math.sin(time * 0.5) * 30

  light4.position.x = Math.sin(time * 0.3) * 30
  light4.position.y = 50 + Math.cos(time * 0.7) * 40
  light4.position.z = Math.sin(time * 0.5) * 30

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position)
    raycaster.ray.origin.y -= 10
	
    let intersections = raycaster.intersectObjects(scene.children)

    let onObject = intersections.length > 0
    let time = performance.now()
//    let delta = (time - prevTime) / 1000
    let delta = 0.015

    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta

    velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward)
    direction.x = Number(moveRight) - Number(moveLeft)
    direction.normalize() // this ensures consistent movements in all directions

    if (moveForward || moveBackward || moveLeft || moveRight) {
	    const camPos = camera.position;
	    Users.me.position.x = camPos.x
	    Users.me.position.y = camPos.y
	    Users.me.position.z = camPos.z

	    mimirs.me.position.x = camPos.x 
	    mimirs.me.position.y = camPos.y
	    mimirs.me.position.z = camPos.z 
	    if(!moving){ 
		    stoping = false
		    moving = setInterval( function(){
			    Users.me.move()
		    }, 400)
	    }
    }else{
	    clearInterval(moving)
	    if(!stoping && moving){
		    stoping = true
		    Users.me.move()
	    }
	    moving = false
    }
    if (moveForward || moveBackward) {
	    velocity.z -= direction.z * 400.0 * delta
    }
    if (moveLeft || moveRight){
	    velocity.x -= direction.x * 400.0 * delta
    }

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y)
      canJump = true
    }

    controls.moveRight(-velocity.x * delta)
    controls.moveForward(-velocity.z * delta)

    controls.getObject().position.y += (velocity.y * delta) // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0
      controls.getObject().position.y = 10

      canJump = true
    }

    prevTime = time
  }

  renderer.render(scene, camera)
}

////////////////////


usuarix.addEventListener('change', function(e){
	if(usuarix.value.length>0){
		cambiarNombrebutton.disabled = false
	}else{
		cambiarNombrebutton.disabled = true
	}
})

cambiarNombrebutton.addEventListener('click', function(e){
	e.preventDefault();
	Users.me.rename(usuarix.value);
	mostrarUsuarix.textContent = usuarix.value
})



mostrarChatbutton.addEventListener('click', function(e){
	e.preventDefault();
	chatContainer.style.display = chatContainer.style.display == 'none' ? '' : 'none'
})

inputMensaje.addEventListener('input', function(e){
	if(inputMensaje.textContent.length > 248){
		inputMensaje.textContent = inputMensaje.textContent.slice(0,248)
	}
})

let Ctrl = false
inputMensaje.addEventListener('keydown', function(e){
	if(e.key == "Control"){
		Ctrl = true
	}else if(e.key == 'Enter'){
		if(Ctrl){
			chat(inputMensaje.innerText)
			inputMensaje.textContent = ""
		}
	}
})

inputMensaje.addEventListener('keyup', function(e){
	if(e.key == "Control"){
		Ctrl = false
	}	
})

mandarMensajebutton.addEventListener('click', function(e){
	e.preventDefault();
	let text = inputMensaje.textContent
	chat(inputMensaje.innerText)
	inputMensaje.textContent = ""
})

instructions.addEventListener('click', function () {
  instructions.style.display = 'none'
	controls.lock()
}, false)

window.addEventListener('addUser', function(event){
	let uuid;
	if(event.detail.uuid === Users.me.uuid){
		uuid = "me"
	}else{
		uuid = event.detail.uuid;
	}
	const position = Users[uuid].position;
	
	const geom = new THREE.SphereBufferGeometry( 5, 32, 32 );
	const mat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	const mimir = new THREE.Mesh( geom, mat );

	mimir.position.x = position.x
	mimir.position.y = position.y
	mimir.position.z = position.z
	scene.add( mimir );
	
	mimirs[uuid] = mimir
})

window.addEventListener('removeUser', function(event){
	const uuid = event.detail.uuid;
	mimirs[uuid].geometry.dispose();
	mimirs[uuid].material.dispose();
	scene.remove(mimirs[uuid]);
	renderer.renderLists.dispose();
	delete mimirs[uuid];
})


window.addEventListener('moveUser', function(event){
	const uuid = event.detail.uuid;
	const newPos = {
		x: Users[uuid].position.x,
		y: Users[uuid].position.y,
		z: Users[uuid].position.z
	};
	const oldPos = {
		x: mimirs[uuid].position.x,
		y: mimirs[uuid].position.y,
		z: mimirs[uuid].position.z
	}

	const dx = newPos.x - oldPos.x 
	const dy = newPos.y - oldPos.y 
	const dz = newPos.z - oldPos.z 

	const mi = 20
	let i = 1

	function interpolate(i){
		mimirs[uuid].position.x = oldPos.x + (dx * i/mi)
		mimirs[uuid].position.y = oldPos.y + (dy * i/mi)
		mimirs[uuid].position.z = oldPos.z + (dz * i/mi)
	}
	const intfunc = setInterval(function(){
		i++;
		interpolate(i)
		if(i==(mi-1)) {
			mimirs[uuid].position.x = newPos.x
			mimirs[uuid].position.y = newPos.y
			mimirs[uuid].position.z = newPos.z
			clearInterval(intfunc)
		}
	},10)

})


//chatear

window.addEventListener('putChat', function(event){
	let from = Users[event.detail.from].nickname;
	const content = event.detail.content;
	
	console.debug(content,'<-')
	let mensaje = document.createElement('div')
	mensaje.classList.add("mensaje")

	let nombre = document.createElement('span')
	nombre.classList.add('nombre')
	nombre.textContent = from

	let contenido = document.createElement('span')
	contenido.classList.add('contenido')
	contenido.textContent = content

	mensaje.appendChild(nombre)
	mensaje.appendChild(contenido)

	document.querySelector("#mensajes").appendChild(mensaje)
})


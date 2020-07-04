
//localStorage.removeItem('uuid')

let camera, scene, renderer, controls
let light1, light2, light3, light4
let clight1, clight2, clight3, clight4
let video, textureVideo, materialVideo

let cil1, cil2, cli3
let floorGeometry, audioSphere, analyser, sphere, audioSphereOrg
var listener, audio, file, loader

var data = []
var objects = []

var raycaster

var skybox
var rainCount = 30000; var rain; var rainGeo; var cloudParticles = []

let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let canJump = false

let moving = false
let stoping = false
let initMedia = false

let prevTime = performance.now()
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
const vertex = new THREE.Vector3()
const color = new THREE.Color()

const cambiarNombrebutton = document.querySelector('#cambiarNombre')
const mostrarChatbutton = document.querySelector('#mostrarChat')
const chatContainer = document.querySelector('#chat')
const inputMensaje = document.querySelector('#inputMensaje')
const mandarMensajebutton = document.querySelector('#mandarMensaje')
const query = document.getElementById('query')
const usuarix = document.querySelector('#usuarix')
const mostrarUsuarix = document.querySelector('#mostrarUsuarix')
const contacto = document.querySelector('#contacto')

init()
animate()
Server.init()

function init () {
  const fftSize = 1024
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.y = -400

  scene = new THREE.Scene()
  scene.background = new THREE.CubeTextureLoader().setPath('/img/').load([
    'px2.png',
    'nx2.png',
    'py2.png',
    'ny2.png',
    'pz2.png',
    'nz2.png'
  ])

  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.25)
  light.position.set(0.5, 1, 0.75)
  scene.add(light)

  controls = new THREE.PointerLockControls(camera, document.body)

  const blocker = document.getElementById('blocker')
  const instructions = document.getElementById('instructions')
  const distopia = document.getElementById('distopia')

  if (usuarix.value.length > 0) {
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

  const onKeyDown = function (event) {
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
        if (canJump === true) // velocity.y += 350
        { canJump = false }
        break
    }
  }

  const onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false
        // Users.me.stop('f')
        break

      case 37: // left
      case 65: // a
        moveLeft = false
        // Users.me.stop('l')
        break

      case 40: // down
      case 83: // s
        moveBackward = false
        // Users.me.stop('f')
        break

      case 39: // right
      case 68: // d
        moveRight = false
        // Users.me.stop('l')
        break
    }
  }

  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)

  // luces huachimontones

  light1 = new THREE.PointLight(0xa58ea8, 6, 250)
  scene.add(light1)
  light2 = new THREE.PointLight(0x7d2f74, 6, 250)
  scene.add(light2)
  light3 = new THREE.PointLight(0x2a315b, 6, 250)
  scene.add(light3)
  light4 = new THREE.PointLight(0x4484b0, 6, 250)
  scene.add(light4)

  // luces ciudad

  clight1 = new THREE.PointLight(0xa58ea8, 2, 300)
  scene.add(clight1)
  clight2 = new THREE.PointLight(0x7d2f74, 2, 300)
  scene.add(clight2)
  clight3 = new THREE.PointLight(0x2a315b, 2, 300)
  scene.add(clight3)
  clight4 = new THREE.PointLight(0x4484b0, 2, 300)
  scene.add(clight4)


	////////////////////////////////////////////                     asdfasdfsd
  var listener = new THREE.AudioListener()
  // camera.add( listener ); // Si es positionalAudio

  audioElement = document.getElementById('music')
  audio = new THREE.Audio(listener)

  audio.setMediaElementSource(audioElement)

  var aSourceMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: scene.background,
    refractionRatio: 0.75
  })

  var aSourceGeometry = new THREE.BoxGeometry(20, 20, 20)

  var aSource = new THREE.Mesh(aSourceGeometry, aSourceMaterial)

  // aSource.add( positionalAudio ); // asociar el audio a una fuente

  scene.add(aSource)

  analyser = new THREE.AudioAnalyser(audio, fftSize)

  // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

  var pilaresMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: scene.background,
    refractionRatio: 0.75
  })

  var pilaresGeometry = new THREE.BoxGeometry(20, 20, 20)

  var cube = []

  // Pilares

  for (var i = 0; i < 100; i++) {
    cube[i] = new THREE.Mesh(pilaresGeometry, pilaresMaterial)
    cube[i].position.x = Math.random() * 800 - 400
    // cube[i].position.y = Math.random() * 400 -200;
    cube[i].position.z = Math.random() * 800 - 900
    var tam = Math.random() * 100
    cube[i].scale.x = 0.2
    cube[i].scale.y = tam
    cube[i].scale.z = 0.2
    scene.add(cube[i])

    // Aqui agregar unas hojas
  }

  // Ciudad

  var cityLoader = new THREE.TextureLoader()

  var cityGeometry = new THREE.BoxGeometry(20, 20, 20)

  var cityTexture = cityLoader.load('img/after.jpg', function (cityTexture) {
    cityTexture.wrapS = cityTexture.wrapT = THREE.RepeatWrapping
    cityTexture.offset.set(0, 0)
    cityTexture.repeat.set(0.5, 0.5)
  })

  var cityMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,

    metalness: 0.1,
    roughness: 0.89,
    // envmap: scene.background,
    // side: THREE.DoubleSide,
    map: cityTexture
    // transparent: true,
    // opacity: 0.75,
  })

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 6; j++) {
      var city = new THREE.Mesh(cityGeometry, cityMaterial)
      // city.wireframe = true;
      // city.wireframeLinewidth = 2;
      var tam = Math.random() * 10

      city.position.x = i * 100 - 500
      city.position.z = j * 100 + 400
      city.position.y = tam + 80
      city.scale.x = 3
      city.scale.y = tam
      city.scale.z = 3

      scene.add(city)
    }
  }

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 6; j++) {
      var city = new THREE.Mesh(cityGeometry, cityMaterial)
      // city.wireframe = true;
      // city.wireframeLinewidth = 2;
      var tam = Math.random() * 10

      city.position.x = i * 100 + 200
      city.position.z = j * 100 + 400
      city.position.y = tam + 80
      city.scale.x = 3
      city.scale.y = tam
      city.scale.z = 3

      scene.add(city)
    }
  }

  // Zordon

  var zordonGeometry = new THREE.CylinderGeometry(150, 150, 270, 32, 1, true, 0, Math.PI)

  // var textureZordon = new THREE.TextureLoader().load( 'img/cyber.png' ); // textura fija

  video = document.getElementById('videoElement')

  zordonTexture = new THREE.VideoTexture(video)

  var zordonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.9,
    map: zordonTexture,
    side: THREE.DoubleSide
  })

  var zordonMesh = new THREE.Mesh(zordonGeometry, zordonMaterial)

  zordonMesh.position.z = 1000
  zordonMesh.position.y = 270 / 2
  zordonMesh.rotation.y = Math.PI / 2

  scene.add(zordonMesh)

  // Huachimontones

  audioSphere = new THREE.SphereGeometry(80, 32, 32)

  audioSphereOrg = new THREE.SphereGeometry(80, 32, 32)

  var audioMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.1
    // envMap: scene.background,
    //
  })

  sphere = new THREE.Mesh(audioSphere, zordonMaterial)
  sphere.geometry.verticesNeedUpdate = true
  sphere.geometry.normalsNeedUpdate = true

  sphere.position.z = -500
  sphere.position.y = 150

  scene.add(sphere)

  var cilMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: scene.background,
    refractionRatio: 0.95
  })

  for (var i = 1; i < 14; i++) {
    var geometryCli = new THREE.CylinderBufferGeometry(200 - (i * 3), 200 - (i * 3), 4, 128)
    geometryCli.computeVertexNormals()
    cil1 = new THREE.Mesh(geometryCli, cilMaterial)
    cil1.position.y = i * 1.5 - 6
    cil1.position.z = -500
    scene.add(cil1)
  }

  // floor

  floorGeometry = new THREE.PlaneGeometry(2000, 2000, 400, 400)
  wetfloorGeometry = new THREE.PlaneGeometry(2000, 2000, 200, 200)

  floorGeometry.rotateX(-Math.PI / 2)
  wetfloorGeometry.rotateX(-Math.PI / 2)

  floorGeometry.computeVertexNormals()
  floorGeometry.computeFaceNormals()

  for (var i = 0; i < floorGeometry.vertices.length; i++) {
    floorGeometry.vertices[i].y += (Math.random() * 6) - 3
  }

  // var texture = new THREE.TextureLoader().load( 'img/texture.jpg' );

  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;

  var floorLoader = new THREE.TextureLoader()

  var floorTexture = floorLoader.load('img/city6.jpg', function (floorTexture) {
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
    floorTexture.offset.set(0, 0)
    floorTexture.repeat.set(10, 10)
  })

  var floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.5,
    roughness: 0.99,
    map: floorTexture
    // transparent: true,
    // opacity: 0.75,
  })

  // var floorMaterial = new THREE.MeshBasicMaterial( { map: texture } );

  var floor = new THREE.Mesh(floorGeometry, floorMaterial)
  var wetfloor = new THREE.Mesh(wetfloorGeometry, pilaresMaterial)

  wetfloor.position.y = -4
  floor.position.y = -4

  scene.add(floor)
  scene.add(wetfloor)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.querySelector('#distopia').appendChild(renderer.domElement)

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

  const time = Date.now() * 0.0005

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

  // City lights

  clight1.position.x = Math.sin(time * 0.7) * 260
  clight1.position.y = 100 + Math.cos(time * 0.5) * 80 + 10
  clight1.position.z = Math.cos(time * 0.3) * 260 + 800

  clight2.position.x = Math.cos(time * 0.3) * 260
  clight2.position.y = 100 + Math.sin(time * 0.5) * 80 + 10
  clight2.position.z = Math.sin(time * 0.7) * 260 + 800

  clight3.position.x = Math.sin(time * 0.7) * 230
  clight3.position.y = 100 + Math.cos(time * 0.3) * 40 + 10
  clight3.position.z = Math.sin(time * 0.5) * 230 + 800

  clight4.position.x = Math.sin(time * 0.3) * 230
  clight4.position.y = 100 + Math.cos(time * 0.7) * 40 + 10
  clight4.position.z = Math.sin(time * 0.5) * 230 + 800

  scene.background.rotation.y += 0.2

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position)
    raycaster.ray.origin.y -= 10

    const intersections = raycaster.intersectObjects(scene.children)

    const onObject = intersections.length > 0
    const time = performance.now()
    //    let delta = (time - prevTime) / 1000
    const delta = 0.015

    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta

    velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward)
    direction.x = Number(moveRight) - Number(moveLeft)
    direction.normalize() // this ensures consistent movements in all directions

    if (moveForward || moveBackward || moveLeft || moveRight) {
	    const camPos = camera.position
	    Users.me.position.x = camPos.x
	    Users.me.position.y = camPos.y
	    Users.me.position.z = camPos.z

	    mimirs.me.position.x = camPos.x
	    mimirs.me.position.y = camPos.y
	    mimirs.me.position.z = camPos.z
	    if (!moving) {
		    stoping = false
		    moving = setInterval(function () {
			    Users.me.move()
		    }, 400)
	    }
    } else {
	    clearInterval(moving)
	    if (!stoping && moving) {
		    stoping = true
		    Users.me.move()
	    }
	    moving = false
    }
    if (moveForward || moveBackward) {
	    velocity.z -= direction.z * 400.0 * delta
    }
    if (moveLeft || moveRight) {
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

/// /////////////////

usuarix.addEventListener('change', function (e) {
  if (usuarix.value.length > 0) {
    cambiarNombrebutton.disabled = false
  } else {
    cambiarNombrebutton.disabled = true
  }
})

cambiarNombrebutton.addEventListener('click', function (e) {
  e.preventDefault()
  Users.me.rename(usuarix.value)
  mostrarUsuarix.textContent = usuarix.value
})

mostrarChatbutton.addEventListener('click', function (e) {
  e.preventDefault()
  chatContainer.style.display = chatContainer.style.display == 'none' ? '' : 'none'
})

inputMensaje.addEventListener('input', function (e) {
  if (inputMensaje.textContent.length > 248) {
    inputMensaje.textContent = inputMensaje.textContent.slice(0, 248)
  }
})

let Ctrl = false
inputMensaje.addEventListener('keydown', function (e) {
  if (e.key == 'Control') {
    Ctrl = true
  } else if (e.key == 'Enter') {
    if (Ctrl) {
      chat(inputMensaje.innerText)
      inputMensaje.textContent = ''
    }
  }
})

inputMensaje.addEventListener('keyup', function (e) {
  if (e.key == 'Control') {
    Ctrl = false
  }
})

mandarMensajebutton.addEventListener('click', function (e) {
  e.preventDefault()
  const text = inputMensaje.textContent
  chat(inputMensaje.innerText)
  inputMensaje.textContent = ''
})

instructions.addEventListener('click', function () {
  instructions.style.display = 'none'
  controls.lock()
  if (!initMedia) {
    audioElement.play() // esto tiene que hacerse solamente una ez
    if (flvjs.isSupported()) {
      var videoElement = document.getElementById('videoElement')
      flvPlayer = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: 'http://134.122.125.230/live?port=1935&app=testing&stream=hola'
      })

      flvPlayer.attachMediaElement(videoElement)
      flvPlayer.load()
      flvPlayer.play()
      flvPlayer.on('error', function (err) {
        if (err === 'NetworkError') {
          flvPlayer.unload()
          flvPlayer.load()
          flvPlayer.play()
        }
      })
    }
    initMedia = true
  }
}, false)

window.addEventListener('addUser', function (event) {

  let uuid
  if (event.detail.uuid === Users.me.uuid) {
    uuid = 'me'
  } else {
    uuid = event.detail.uuid
  }
  /*
	const position = Users[uuid].position

  const geom = new THREE.SphereBufferGeometry(5, 32, 32)
  const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  const mimir = new THREE.Mesh(geom, mat)

  mimir.position.x = position.x
  mimir.position.y = position.y
  mimir.position.z = position.z
  */
				// model
	console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
	var loader = new THREE.FBXLoader();
	loader.load( '/models/fbx/monito.fbx', function ( object ) {
		scene.add( object );
		mimirs[uuid] = object
		console.log("UWU")

	});

})

window.addEventListener('removeUser', function (event) {
  const uuid = event.detail.uuid
  mimirs[uuid].geometry.dispose()
  mimirs[uuid].material.dispose()
  scene.remove(mimirs[uuid])
  renderer.renderLists.dispose()
  delete mimirs[uuid]
})

window.addEventListener('moveUser', function (event) {
  const uuid = event.detail.uuid
  const newPos = {
    x: Users[uuid].position.x,
    y: Users[uuid].position.y,
    z: Users[uuid].position.z
  }
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

  function interpolate (i) {
    mimirs[uuid].position.x = oldPos.x + (dx * i / mi)
    mimirs[uuid].position.y = oldPos.y + (dy * i / mi)
    mimirs[uuid].position.z = oldPos.z + (dz * i / mi)
  }
  const intfunc = setInterval(function () {
    i++
    interpolate(i)
    if (i == (mi - 1)) {
      mimirs[uuid].position.x = newPos.x
      mimirs[uuid].position.y = newPos.y
      mimirs[uuid].position.z = newPos.z
      clearInterval(intfunc)
    }
  }, 10)
})

// chatear

window.addEventListener('putChat', function (event) {
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
})

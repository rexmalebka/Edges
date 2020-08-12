import * as THREE from '/js/three/build/three.module.js';

//let pos = {x:-550.8884125720521, y: 14, z: -490.75654644504897}
export const Debug = true

let bounds = [
	[45,30,1.5, -551,14,-525],
	[1.5,30,144, -530,14,-453],
	[1.5,30,144, -573,14,-410],
	[144,30,1.5, -500, 14,-339],
	[144,30,1.5, -458, 14, -381],
	[1,30,144, -387, 14, -309],
	[1,30,144, -429, 14, -267],
	[288,30,1.5, -285, 14,-194],
	[102,30,1.5, -337, 14,-238],
	[240,30,1, -20,14,94],
	[1,30,246, -285.5, 14, -359],
	[1,30,102, -242.5, 14, -288],
	[1,30,146, -242.5, 14, -450],
	[144,30,1.5, -171, 14,-238],
	[1.5,30,146, -98, 14,-165],
	[1.5,30,299, -142, 14, -46],
	[1.5,30,299, -142, 14, -46], //16

	[1.5,30,146, 531,14,453],
	[1.5,30,146, 574,14,411],
	[46,30,1.5,  553,14,525],
	[144,30,1.5, 460,14,381],
	[144,30,1.5, 502,14,338],
	[1.5,30,146, 387,14,309],
	[1.5,30,146, 430,14,266],
	[289,30,1.5, 286,14,194],
	[102,30,1.5, 336,14,238],
	[146,30,1.5, 173,14,238],
	[1.5,30,144, 99,14,165],
	[1.5,30,289, 142,14,50],
	[240,30,1.5, -20,14,93.5],
	[244,30,1.5, 22,14,-93.5],
	[1, 30, 101, 242, 14, 288],
	[1, 30, 244, 285, 14, 360],
	[1, 30, 150, 242, 14, 456],
	[145, 30, 1, 357, 14, 482],
	[144, 30, 1, 315, 14, 526],
	[1, 30, 150, 429, 14, 552],
	[1, 30, 102, 386, 14, 575], //37
	
	[102, 30, 1, 410,14, 719],
	[1, 30, 102, 361,14, 667],
	[1, 30, 102, 455,14, 667],
	[25, 30, 1.5, 374,14, 626.5],
	[25, 30, 1.5, 442,14, 626.5],
]

bounds.push(
	[1,30,100, 74,35,-16],
	[1,30,100, 99,35,-16],
	[27,1,100, 88,25,-16],
	
	[1,30,100, -74,30,14],
	[1,30,100, -98,30,14],
	[27,1,100, -88,25,14],
)

let mat = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent:true, opacity:0.8} );
let geom = new THREE.BoxBufferGeometry( 1, 1, 1 );



let B = bounds.map(x => {
	let mesh = new THREE.Mesh( geom, mat)
	mesh.scale.set(x[0], x[1], x[2])
	mesh.position.set(x[3], x[4], x[5])
	return mesh
})

B[B.length-1].rotation.x =0.4
B[B.length-2].rotation.x =0.4
B[B.length-3].rotation.x =0.4

B[B.length-4].rotation.x =-0.4
B[B.length-5].rotation.x =-0.4
B[B.length-6].rotation.x =-0.4

//////////  stairs
let ss = [
	[24.5,15,100, -86,35,14],
	[24.5,15,100, 86.5,35,-18],
]

let s = ss.map(s=>{
	let mat2 = mat.clone()
	mat2.color.g =0
	mat2.color.b =1

	let mesh = new THREE.Mesh( geom, mat2)
	mesh.scale.set(s[0], s[1], s[2])
	mesh.position.set(s[3], s[4], s[5])
	return mesh
} )

//////////  ANTIstairs
let ass = [
	[24.5,15,120, -86,47,24],
	[24.5,25,100, 86.5,45,-31],
]

let as = ass.map(s=>{
	let mat2 = mat.clone()
	mat2.color.g =0
	mat2.color.r =1

	let mesh = new THREE.Mesh( geom, mat2)
	mesh.scale.set(s[0], s[1], s[2])
	mesh.position.set(s[3], s[4], s[5])
	return mesh
} )

s[0].rotation.x = 0.4
s[1].rotation.x = -0.4
//s[1].rotation.x = -0.4

as[0].rotation.x = 0.4
as[1].rotation.x = -0.4

window.Bounds = B
export const Bounds = B
export const stairs = s
export const antistairs = as


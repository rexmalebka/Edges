import * as THREE from '/js/three/build/three.module.js';

export const raycaster = {
	init: function(me, scene){
		this.raycaster = new THREE.Raycaster();
		this.me = me
		this.scene = scene
		this.dir = new THREE.Vector3(0,-1,0)
		this.raycaster.setFromCamera( this.dir, this.me );    

		function callback(){
			requestAnimationFrame(callback)
			raycaster.check()
		}
		this.f = requestAnimationFrame(callback)
		//this.f = setInterval(callback, 1000)

		this.dist = 15
		this.locked_pos = {
			x:0,
			y:0,
			z:0,
		}
		return this
	},

	check: function(){
		raycaster.raycaster.setFromCamera( raycaster.dir, raycaster.me );    
		let intersects = raycaster.raycaster.intersectObjects( raycaster.scene.children, true );
		intersects = intersects.filter(x => x.object.type == 'Mesh')
		let unique = [...new Set(intersects.map(x => intersects.find(y => (y.object.uuid == x.object.uuid)  )))]
		//let dist = unique.map(x=>x.distance)
		
		let closest = unique.filter( x => x.distance <= raycaster.dist )
		if(closest.length > 0){
			if(edges.controls.moveForward){
				edges.controls.moveForward = false
			}
			
			if(edges.controls.moveBackward){
				edges.controls.moveBackward = false
			}
			
			if(edges.controls.moveRight){
				edges.controls.moveRight = false
			}
			if(edges.controls.moveLeft){
				edges.controls.moveLeft = false
			}
			Users.me.move();
			Users.me.rotate();
		}
	}
}

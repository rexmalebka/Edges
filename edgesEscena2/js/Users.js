class User {
	constructor(uuid, nickname, position, rotation){
		this.uuid = uuid;
		this.nickname = nickname;
		this.position = position;
		this.rotation = rotation;
		this.moving = {
			frontal: false,
			left: false,
		};
		this.rotating = {
			x: false,
			y: false,
			x: false
		};
		this.movingFunc = {
			frontal: null,
			left: null
		};
		this.rotatingFunc = {
			x: null,
			y: null,
			z: null
		};
		this.add = new CustomEvent('addUser', { 
			detail: {
				uuid: uuid,
			}
		});
		this.renameUser = new CustomEvent('renameUser', { 
			detail: {
				uuid: uuid,
			}
		});
		this.remove = new CustomEvent('removeUser', { 
			detail: {
				uuid: uuid,
				nickname: nickname,
				position: position,
				rotation: rotation
			}
		});
		this.moveUser = new CustomEvent('moveUser', {
			detail:{
				uuid: uuid
			}
		})
	}
};



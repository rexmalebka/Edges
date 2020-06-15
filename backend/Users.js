class User {
	constructor(uuid, conn, nickname, position, rotation){
		this.uuid = uuid;
		this.conn = conn;
		this.nickname = nickname;
		this.position = position;
		this.rotation = rotation;
	}
}

const Users = {
}

exports.Users = Users
exports.User = User

'use strict'
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
// const io = require('socket.io')(3000);
const { Users, chat } = require('./Users.js')

app.use('/', express.static('static'))
  function checkConnection (_conn) {
    if (!_conn.handshake.query.user) {
  	  return false
    }

    let query = ''
    try {
      query = JSON.parse(_conn.handshake.query.user)
    } catch (e) {
      return false
    }

    if (query.length != 8) {
  	  return false
    }

    if (query[0].length == 0) return false
    let uuid = query[0]
    if (uuid == 'testing') {
      uuid = Math.random().toString(16).substr(2)
    }
    const nickname = query[1]

    if (isNaN(query[2]) || isNaN(query[3]) || isNaN(query[4]) || isNaN(query[5]) || isNaN(query[6]) || isNaN(query[7])) return false

    const position = {
      x: query[2],
      y: query[3],
      z: query[4]
    }

    const rotation = {
      x: query[5],
      y: query[6],
      z: query[7]
    }

    return { uuid: uuid, nickname: nickname, position: position, rotation: rotation }
  }

io.on('connection', (conn) => {
  const compliance = checkConnection(conn)
  if (!compliance) {
	  console.debug(Object.keys(conn))
	  conn.emit('disconnect')
    return
  }

  const { uuid, nickname, position, rotation } = compliance
  try{
    Users[uuid] = {
      uuid: uuid,
      nickname: nickname,
      position: position,
      rotation: rotation,
      conn: conn
    }
  }catch(error){
	  conn.emit('disconnect')
	  return
  }

  console.log(`user "${nickname}" (${uuid}) ${uuid} join `)

  conn.on('disconnect', function (asdf) {
    console.log(`user "${Users[uuid].nickname}" (${uuid}) left`)
    delete Users[uuid]
  })

  conn.on('rename', function (name) {
    function check (_name) {
  	  if (Users[uuid].nickname == _name) return false
  	  return true
    }

    if (!check(name)) return

    console.log(`\t> renaming user ${uuid} from ${Users[uuid].nickname} to ${name}`)
    Users[uuid].nickname = name
  })

  conn.on('chat', function (msg) {
    function check (_msg) {
  	  if (_msg.length == 0) return false
  	  return true
    }
    if (!check(msg)) return
    console.log(`\t> user ${uuid} chatting`)
    chat(uuid, msg)
  })

  conn.on('move', function (position) {
    function check (_position) {
  	  if (!_position || !Array.isArray(_position) || _position.length != 3) return false
  	  if (typeof _position[0] !== 'number' || typeof _position[1] !== 'number' || typeof _position[2] !== 'number') return false
  	  if (Users[uuid].position.x == _position[0] && Users[uuid].position.y == _position[1] && Users[uuid].position.z == _position[2]) return false
  	  return true
    }
	  console.debug("moving",position)
    if (!check(position)) return
    const pos = {
      x: position[0],
      y: position[1],
      z: position[2]
    }
    Users[uuid].position = pos
  })

/*
  conn.on('mF', function (data) {
    function check (_data) {
  	  if (!_data || !Array.isArray(_data) || _data.length != 7) return false
  	  if (
		  typeof _data[0] !== 'boolean' || 
		  typeof _data[1] !== 'number' || 
		  typeof _data[2] !== 'number' || 
		  typeof _data[3] !== 'number' ||
		  typeof _data[4] !== 'number' || 
		  typeof _data[5] !== 'number' || 
		  typeof _data[6] !== 'number'
	  ) return false
  	  return true
    }

    if (!check(position)) return
    const mv = data[0]
    const pos = {
      x: position[1],
      y: position[2],
      z: position[3]
    }
    const rot = {
      x: position[4],
      y: position[5],
      z: position[6]
    }
    console.log("")
    // [mf? , x, y, z, rx, ry,rz]	
  })
  */
/*
  conn.on('move', function (d) {
	  console.debug(d)
  });

  conn.on('stop', function (d) {
	  console.debug(d)
  });
*/
})

const port = process.env.PORT | 3000
console.log(`starting server on port ${port}`)
server.listen(port)

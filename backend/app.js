const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
// const io = require('socket.io')(3000);
const { Users, chat } = require('./Users.js')

app.use('/', express.static('static'))

io.on('connection', (conn) => {
  if (!conn.handshake.query.user) return

  let query = ''
  try {
    query = JSON.parse(conn.handshake.query.user)
  } catch (e) {
    return
  }

  const uuid = query[0]
  const nickname = query[1]
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

  Users[uuid] = [uuid, nickname, position, rotation, conn]

  console.log(`user "${nickname}" (${uuid}) ${uuid} join`)

  conn.on('disconnect', function (asdf) {
    console.log(`user "${nickname}" (${uuid}) left`)
    delete Users[uuid]
  })

  conn.on('rename', function (name) {
    console.log(`\trenaming user ${uuid} from ${nickname} to ${name}`)
    Users[uuid].nickname = name
  })

  conn.on('chat', function (msg) {
	  chat(uuid, msg)
  })

  conn.on('move', function (position) {
    const pos = {
      x: position[0],
      y: position[1],
      z: position[2]
    }
    Users[uuid].position = pos
  })
})

const port = process.env.PORT | 3000
console.log(`starting server on port ${port}`)
server.listen(port)

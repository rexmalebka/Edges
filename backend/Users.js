const redis = require('redis')

const subscriber = redis.createClient()
const publisher = redis.createClient()

publisher.flushall()

subscriber.subscribe('add')
subscriber.subscribe('leave')
subscriber.subscribe('rename')
subscriber.subscribe('move')

subscriber.subscribe('chat')

subscriber.on('message', function (channel, message) {
  function add (uuid) {
    if (uuid in Users) {
      // advise new about all users
      const conn = Users[uuid].conn
      publisher.smembers('users', function (error, users) {
        if (error) return
        users.forEach((_uuid) => {
          if (_uuid == uuid) return
          publisher.hmget(_uuid, ['nickname', 'position', 'rotation'], function (error, data) {
            if (error) return
            const nickname = data[0]
            const position = JSON.parse(data[1])
            const rotation = JSON.parse(data[2])
            conn.emit('add', [_uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z])

            publisher.sadd(`known_${uuid}`, _uuid)
          })
        })
      })
    }

    // advise all else

    publisher.hmget(uuid, ['nickname', 'position', 'rotation'], function (error, data) {
      const nickname = data[0]
      const position = JSON.parse(data[1])
      const rotation = JSON.parse(data[2])

      for (_uuid in Users) {
        if (_uuid != uuid) {
          const conn = Users[_uuid].conn
          conn.emit('add', [uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z])
        }
      }
    })
  }

  function leave (uuid) {
    for (_uuid in Users) {
      const conn = Users[_uuid].conn
      conn.emit('leave', uuid)
    }
  }

  function rename (uuid) {
    publisher.hmget(uuid, 'nickname', function (error, data) {
      const nickname = data[0]

      for (_uuid in Users) {
        if (_uuid != uuid) {
          const conn = Users[_uuid].conn
          conn.emit('rename', [uuid, nickname])
        }
      }
    })
  }

  function move (uuid) {
    publisher.hmget(uuid, 'position', function (error, data) {
      const position = JSON.parse(data[0])
      console.log('AAAAAAAAAAAAAAAAA position', position)

      for (_uuid in Users) {
        if (_uuid != uuid) {
          const conn = Users[_uuid].conn
          conn.emit('move', [uuid, position.x, position.y, position.z])
        }
      }
    })
  }

  function chat (msg) {
    const parsed = JSON.parse(msg)
    const from = parsed.from
    const content = parsed.content
    for (_uuid in Users) {
      if (_uuid != from) {
        const conn = Users[_uuid].conn
        conn.emit('chat', [from, content])
      }
    }
  }
  switch (channel) {
    case 'add':
      add(message)
      break
    case 'leave':
      leave(message)
      break
    case 'rename':
      rename(message)
      break
    case 'move':
      move(message)
      break
    case 'chat':
      chat(message)
      break
  }
})

class User {
  constructor (uuid, nickname, position, rotation) {
    this.uuid = uuid
    this.nickname = nickname
    this.position = position
    this.rotation = rotation
  }
}

const Users = new Proxy({}, {
  get: function (target, uuid) {
    return target[uuid]
  },
  set: function (target, name, value) {
    // check if not exists in redis
    const uuid = value[0]
    const nickname = value[1]
    const position = value[2]
    const rotation = value[3]
    const conn = value[4]

    target[uuid] = new Proxy(new User(uuid, nickname, position, rotation), {
      get: function (usr, name) {
        return usr[name]
      },
      set: function (usr, name, value) {
        switch (name) {
          case 'conn':
            usr.conn = value
            break
          case 'nickname':
            usr.nickname = value
            publisher.hmset(uuid, 'nickname', value)
            publisher.publish('rename', uuid)
            break
          case 'position':
            console.log(value, 'position --------')
            usr.position = value
            publisher.hmset(uuid, 'position', JSON.stringify(value))
            publisher.publish('move', uuid)
            break
        }
      },
      OwnKeys: function (usr) {
        return Object.keys(usr)
      }
    })

    if (conn) {
      target[uuid].conn = conn
    }
    publisher.sadd('users', uuid)
    publisher.hmset(uuid, 'uuid', uuid, 'nickname', nickname, 'position', JSON.stringify(position), 'rotation', JSON.stringify(rotation))
    publisher.publish('add', uuid)
  },
  deleteProperty: function (target, uuid) {
    publisher.srem('users', uuid)
    publisher.del(uuid)
    delete target[uuid]
    publisher.publish('leave', uuid)
  },
  OwnKeys: function (target) {
    return Object.keys(target)
  },
  has: function (target, uuid) {
    return Object.keys(target).includes(uuid)
  }
})

function chat (from, content) {
  publisher.publish('chat', JSON.stringify({ from: from, content: content }))
}

exports.Users = Users
exports.chat = chat

const redis = require('redis')

const subscriber = redis.createClient()
const publisher = redis.createClient()

publisher.flushall()

subscriber.subscribe('add')
subscriber.subscribe('leave')
subscriber.subscribe('rename')
subscriber.subscribe('move')

subscriber.subscribe('chat')

function CheckAdd (_data) {
  if (!_data || !Array.isArray(_data) || _data.length !== 3) return false
  const nickname = _data[0]
  let position
  let rotation
  try {
    position = JSON.parse(_data[1])
    rotation = JSON.parse(_data[2])
  } catch (error) {
    console.debug('ERROR', error)
    return false
  }
  if (!position || !rotation) return false
  if (typeof position.x !== 'number' || typeof position.y !== 'number' || typeof position.z !== 'number') return false
  if (typeof rotation.x !== 'number' || typeof rotation.y !== 'number' || typeof rotation.z !== 'number') return false
  return {
    nickname: nickname,
    position: position,
    rotation: rotation
  }
}
function add (uuid) {
  if (uuid in Users) {
    // advise new about all users
    const conn = Users[uuid].conn
    publisher.smembers('users', function (error, users) {
      if (error) return
      users.forEach((_uuid) => {
        if (_uuid === uuid) return
        publisher.hmget(_uuid, ['nickname', 'position', 'rotation'], function (error, data) {
          if (error) return

          const compliance = CheckAdd(data)
          if (!compliance) return
          const { nickname, position, rotation } = compliance

          conn.emit('add', [_uuid, nickname, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z])
        })
      })
      users = null
    })
  }
  
  // advise all else

  publisher.hmget(uuid, ['nickname', 'position', 'rotation'], function (error, data) {
    const compliance = CheckAdd(data)
    if (!compliance) return
    const { nickname, position, rotation } = compliance
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

    for (_uuid in Users) {
      if (_uuid != uuid) {
        const conn = Users[_uuid].conn
        conn.emit('move', [uuid, position.x, position.y, position.z])
      }
    }
  })
}
function chatp (msg) {
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
subscriber.on('message', function (channel, message) {
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
      chatp(message)
      break
  }
  channel = null
  message = null
})

class User {
  constructor (uuid, nickname, position, rotation, conn) {
    this.uuid = uuid
    this.nickname = nickname
    this.position = position
    this.rotation = rotation
    this.conn = conn
  }
}

function userProxy(uuid, nickname, position, rotation, conn){
  return new Proxy(new User(uuid, nickname, position, rotation, conn), {
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
          if (typeof value.x !== 'number' || typeof value.y !== 'number' || typeof value.z !== 'number') {
            break
          }
          usr.position = value
          publisher.hmset(uuid, 'position', JSON.stringify(value))
          publisher.publish('move', uuid)
          break
      }
      return true
    },
    OwnKeys: function (usr) {
      return Object.keys(usr)
    }
  })
}
function checkUsersSet(_name, _value) {
  if (_name.length == 0) return false
  if (
    !_value.uuid ||
    !_value.nickname ||
    !_value.position ||
    !_value.rotation ||
    !_value.conn
  ) return false
  if (
    typeof (_value.position.x) !== 'number' ||
    typeof (_value.position.y) !== 'number' ||
    typeof (_value.position.z) !== 'number'
  ) return false

  if (
    typeof (_value.rotation.x) !== 'number' ||
    typeof (_value.rotation.y) !== 'number' ||
    typeof (_value.rotation.z) !== 'number'
  ) return false

  const uuid = _value.uuid
  const nickname = _value.nickname
  const position = _value.position
  const rotation = _value.rotation
  const conn = _value.conn

  return {
    uuid: uuid,
    nickname: nickname,
    position: position,
    rotation: rotation,
    conn: conn
  }
}

const Users = new Proxy({}, {
  get: function (target, uuid) {
    if (!target[uuid]) { return { uuid: '', nickname: '', position: {}, rotation: {} } }
    return target[uuid]
  },
  set: function (target, name, value) {
    if (target[name]) return false
    const compliance = checkUsersSet( name, value)
    if (!compliance) return false
    const { uuid, nickname, position, rotation, conn } = compliance

    target[uuid] = userProxy(uuid, nickname, position, rotation, conn)

    publisher.sadd('users', uuid)
    publisher.hmset(uuid, 'uuid', uuid, 'nickname', nickname, 'position', JSON.stringify(position), 'rotation', JSON.stringify(rotation))
    publisher.publish('add', uuid)
    return true
  },
  deleteProperty: function (target, uuid) {
    if (!target[uuid]) return
    publisher.srem('users', uuid)
    publisher.del(uuid)
    delete target[uuid]
    publisher.publish('leave', uuid)
    return true
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

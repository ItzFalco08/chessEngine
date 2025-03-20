const { WebSocketServer } = require('ws')
const { GameManager } = require('./GameManager')

const wss = new WebSocketServer({port: 8080})

const GameManager = new GameManager()

wss.on('connection', (socket)=> {
    GameManager.addUser(socket)
    socket.on('disconnect', GameManager.removeUser(socket))
})

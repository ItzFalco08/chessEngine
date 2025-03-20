const Game = require('./Game')

export class GameManager {
    constructor() {
        this.games = []
        this.users = []
        this.pendingUser;
    }

    addUser(socket) {
        this.users.push(socket)
        this.handleMessage(socket)
    }

    removeUser(socket) {
        this.users = this.users.filter((user)=> user !== socket)
    }

    handleMessage(socket) {
        socket.on('init_game', (data)=> {
            if (this.pendingUser) {
                // start a game
                const game = new Game(this.pendingUser, socket)
                this.games.push(game)
                this.pendingUser = null
                
            } else {
                this.pendingUser = socket
            }
        })
    }
}
const Game = require('./Game/Game')
const http = require('http')
const {Server} = require('socket.io')
const express = require('express')
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

const gameInstances = []
Game.deleteAllRooms()

module.exports = gameInstances

app.use(express.static(`${__dirname}/public`))

io.on('connection', socket =>{
    console.log(socket.id)
    socket.on('createRoom', (username) =>{
        socket.username = username
        const game = new Game(socket.id, username)
        addGameInstance(game)
        game.createRoom()
        .then(() =>{
            socket.emit('redirect', game.getRoomURL())
        })
    })
    socket.on('joinRoom', ({ username, room }) =>{
        socket.username = username
        socket.emit('redirect', `rooms/${room}.html`)
    })
})

function addGameInstance(gameInstance){
    gameInstances.push(gameInstance)
}

function delGameInstance(roomID){
    gameInstanceIndex = gameInstances.findIndex(instance =>{
        return instance.getRoomID() == roomID
    })
    gameInstances.splice(gameInstanceIndex, 1)
}

app.use('/', require('./routes/root'))

httpServer.listen(3030)
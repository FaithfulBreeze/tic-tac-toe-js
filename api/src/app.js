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

    socket.on('joinGameRoom', ({ roomID, username }) =>{
        const gameInstance = getGameInstance(roomID)
        const gameOwner = gameInstance.getOwner()
        if(username != gameInstance.getOwner()){
            gameInstance.setPlayer2(username, socket.id)
        }else{
            gameInstance.setPlayer1(username, socket.id)
        }
        socket.join(roomID)
        io.to(roomID).emit('joinedRoom', gameOwner, gameInstance.getPlayer2().playerName)
    })

    socket.on('renderGame', socketRequest =>{
        const { houses, roomID } = socketRequest
        const gameInstance = getGameInstance(roomID)
        gameInstance.renderGame(houses)
        io.to(roomID).emit('updateGamePannel', gameInstance.getHouses())
    })

    socket.on('createRoom', (username) =>{
        const game = new Game(socket.id, username)
        addGameInstance(game)
        game.createRoom()
        .then(() =>{
            socket.emit('redirect', game.getRoomURL())
        })
    })

    socket.on('joinRoom', (room) =>{
        socket.emit('redirect', `rooms/${room}.html`)
    })
})

function addGameInstance(gameInstance){
    gameInstances.push(gameInstance)
}

function getGameInstance(roomID){
    return gameInstances.find(instance => instance.getRoomID() == roomID)
}

app.use('/', require('./routes/root'))

httpServer.listen(3030)
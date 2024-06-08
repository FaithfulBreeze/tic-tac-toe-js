const Game = require('./Game/Game')
const http = require('http')
const {Server} = require('socket.io')
const express = require('express')
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

const gameInstances = []

// clears all rooms when server turns on
Game.deleteAllRooms()

module.exports = gameInstances

app.use(express.static(`${__dirname}/public`))

io.on('connection', socket =>{

    // receives request to create a game romm
    socket.on('createRoom', (username) =>{
        const game = new Game(socket.id, username)
        addGameInstance(game)
        game.createRoom()
        .then(() =>{
            socket.emit('redirect', game.getRoomURL())
        })
    })

    // comes from main menu, when player2 asks to join room
    socket.on('joinRoom', (room) =>{
        socket.emit('redirect', `rooms/${room}.html`)
    })

    // ^ main menu
    // v game room 

    // receives request to join the game room (channel)
    socket.on('joinGameRoom', ({ roomID, username }) =>{
        const gameInstance = getGameInstance(roomID)
        const gameOwner = gameInstance.getOwner()
        if(username != gameOwner){
            gameInstance.setPlayer2({playerName: username, socketID: socket.id})
        }else{
            gameInstance.setPlayer1({playerName: username, socketID: socket.id})
        }
        const player1 = gameInstance.getPlayer1()
        const player2 = gameInstance.getPlayer2()
        socket.join(roomID)
        io.to(roomID).emit('joinedRoom', player1.playerName, player2.playerName ?? false)
    })

    socket.on('loadPlayersTurnState', roomID =>{
        const gameInstance = getGameInstance(roomID)
        if(socket.id == gameInstance.getPlayer1().socketID){
            const playerSocketID = gameInstance.generateFirstTurn()
            gameInstance.setPlayerTurnByID(playerSocketID, true)
            const player = gameInstance.getPlayerByID(playerSocketID)
            const players = gameInstance.getPlayers()
            io.emit('updatePlayersOnClients', players)
            io.emit('firstTurn', player.playerName)
        }
    })

    // receives request to render game on server-side
    socket.on('renderGame', socketRequest =>{
        const { house, roomID } = socketRequest
        const gameInstance = getGameInstance(roomID)
        const { win, draw } = gameInstance.renderGame(house)
        if(draw){
            io.to(roomID).emit('draw')
        }
        if(win){
            const winner = gameInstance.getPlayerByID(house.owner)
            io.to(roomID).emit('userWin', winner.playerName)
        }
        io.to(roomID).emit('updateHousesOnClients', gameInstance.getHouses())
        if(gameInstance.getGameEnded()){
            delGameInstance(roomID)
            gameInstance.deleteRoom()
        }
    })

    socket.on('changeTurns', socketRequest =>{
        const { roomID } = socketRequest
        const gameInstance = getGameInstance(roomID)
        const players = gameInstance.updatePlayersTurn()
        io.emit('updatePlayersOnClients', players)
    })
})

// pushes to gameInstances array a new gameInstance
function addGameInstance(gameInstance){
    gameInstances.push(gameInstance)
}

// removes the game stance from gameInstances array
function delGameInstance(roomID){
    const index = gameInstances.findIndex(gameInstance => gameInstance.getRoomID() == roomID)
    gameInstances.splice(index, 1)
}

// returns the gameInstance of the given roomID
function getGameInstance(roomID){
    return gameInstances.find(instance => instance.getRoomID() == roomID)
}

app.use('/', require('./routes/root'))

httpServer.listen(6060)
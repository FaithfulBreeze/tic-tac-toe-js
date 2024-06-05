const fs = require('fs').promises
const { join } = require('path')

class Game{
    constructor(roomID, owner){
        this.roomID = roomID
        this.playerCount = 0
        this.gameOwner = owner
        this.isRoomFull = false
        this.gameLifeTime = this.gameLifeTimeout()
        this.houses = []
        this.player1 = {}
        this.player2 = {}
    }

    renderGame(data){
        this.resetGameLifeTime()
        this.houses = data
    }

    setPlayer1(playerName, socketID){
        this.player1.playerName = playerName
        this.player1.socketID = socketID
    }

    setPlayer2(playerName, socketID){
        this.player2.playerName = playerName
        this.player2.socketID = socketID
    }

    getPlayer1(){
        return this.player1
    }

    getPlayer2(){
        return this.player2
    }

    getHouses(){
        return this.houses
    }

    getOwner(){
        return this.gameOwner
    }

    resetGameLifeTime(){
        clearTimeout(this.gameLifeTime)
        this.gameLifeTime = this.gameLifeTimeout()
    }

    gameLifeTimeout(){
        return setTimeout(async () =>{
            await this.deleteRoom()
        }, 300000)
    }

    handlePlayerJoin(){
        this.playerCount++
        if(this.playerCount == 2)
            this.isRoomFull = true
    }

    getRoomID(){
        return this.roomID
    }

    getIsRoomFull(){
        return this.isRoomFull
    }

    getRoomURL(){
        return `rooms/${this.roomID}.html`
    }

    async createRoom(){
        const roomTemplate = await (await fs.readFile(join(__dirname, '..', 'rooms', 'roomTemplate', 'roomTemplate.html')))
        .toString()
        .split('#id#')
        .join(this.roomID)
        
        return fs.writeFile(join(__dirname, '..', 'rooms', `${this.roomID}.html`), roomTemplate)
    }

    async deleteRoom(){
        return fs.unlink(join(__dirname, '..', 'rooms', `${this.roomID}.html`))
    }

    static async deleteAllRooms(){
        const dirFiles = await fs.readdir(join(__dirname, '..', 'rooms'))
        dirFiles.splice(dirFiles.indexOf('roomTemplate'), 1)
        for(let file of dirFiles){
            fs.unlink(join(__dirname, '..', 'rooms', file))
        }
    }
}

module.exports = Game
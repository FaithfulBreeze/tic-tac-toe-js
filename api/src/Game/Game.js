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
        this.gameEnded = false
    }

    getGameEnded(){
        return this.gameEnded
    }

    renderGame(house){
        this.resetGameLifeTime()
        this.houses.push(house)
        if(this.gameEnded == false){
            if(this.houses.length == 9){
                this.gameEnded = true
                return { draw: true }
            }else{
                if(this.checkHousesMatch(house)){
                    this.gameEnded = true
                    return { win: true }
                }else{
                    return { win: false }
                }
            }
        }
    }

    checkHousesMatch(requestedHouse){
        let match = false
        const { index } = requestedHouse
        const middleHouses = [1, 3, 4, 5, 7]
        const ownerHousesIndexes = []
        for(let house of this.houses){
            if(house.owner == requestedHouse.owner){
                ownerHousesIndexes.push(house.index)
            }
        }
        for(let i = 1 ; i <= 4 ; i++){
            if(middleHouses.includes(index)){
                let doesMatchPlus = ownerHousesIndexes.includes(index + i)
                let doesMatchMinus = ownerHousesIndexes.includes(index - i)
                if(doesMatchMinus && doesMatchPlus)
                    match = true
            }else{
                let doesMatchOne = ownerHousesIndexes.includes(index + i)
                let doesMatchTwo = ownerHousesIndexes.includes(index + i + i)
                if(doesMatchOne && doesMatchTwo)
                    match = true
                
                doesMatchOne = ownerHousesIndexes.includes(index - i)
                doesMatchTwo = ownerHousesIndexes.includes(index - i - i)
                if(doesMatchOne && doesMatchTwo)
                    match = true
            }
        }
        return match
    }
    
    setPlayer1(playerData){
        const { playerName, socketID, turn = false } = playerData
        this.player1.playerName = playerName
        this.player1.socketID = socketID
        this.player1.turn = turn
    }

    setPlayer2(playerData){
        const { playerName, socketID, turn = false } = playerData
        this.player2.playerName = playerName
        this.player2.socketID = socketID
        this.player2.turn = turn 
    }

    getPlayer2(){
        return this.player2
    }

    getPlayer1(){
        return this.player1
    }

    updatePlayersTurn(){
        this.player1.turn = !this.player1.turn
        this.player2.turn = !this.player2.turn
        const player1 = this.player1
        const player2 = this.player2
        return { player1, player2 }
    }

    generateFirstTurn(){
        const randomNumber = Math.trunc(Math.random()*100)
        if(randomNumber % 2 == 0){
            return this.player1.socketID
        }else{
            return this.player2.socketID
        }
    }

    setPlayerTurnByID(socketID, turnValue){
        if(this.player1.socketID == socketID){
            this.player1.turn = turnValue
        }else{
            this.player2.turn = turnValue
        }
    }

    getPlayerByID(socketID){
        if(this.player1.socketID == socketID){
            return this.getPlayer1()
        }else{
            return this.getPlayer2()
        }
    }

    getPlayers(){
        const player1 = this.player1
        const player2 = this.player2
        return { player1, player2 }
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
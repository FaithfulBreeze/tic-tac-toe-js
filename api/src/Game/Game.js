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

    renderGame(house){
        this.resetGameLifeTime()
        this.houses.push(house)
        for(let house of this.houses){
            if(this.checkHousesMatch(house)){
                return { win: true, winner: house.owner }
            }else{
                return { win: false }
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
                const doesMatchPlus = ownerHousesIndexes.includes(index + i)
                const doesMatchMinus = ownerHousesIndexes.includes(index - i)
                if(doesMatchMinus && doesMatchPlus){
                    match = true
                }
            }else{
                if(index == 0 || index == 2){
                    const doesMatchOne = ownerHousesIndexes.includes(index + i)
                    const doesMatchTwo = ownerHousesIndexes.includes(index + i + i)
                    if(doesMatchOne && doesMatchTwo)
                        match = true
                }else{
                    const doesMatchOne = ownerHousesIndexes.includes(index - i)
                    const doesMatchTwo = ownerHousesIndexes.includes(index - i - i)
                    if(doesMatchOne && doesMatchTwo)
                        match = true
                }
            }
        }
        return match
    }

    setPlayer1(playerName, socketID){
        this.player1.playerName = playerName
        this.player1.socketID = socketID
    }

    setPlayer2(playerName, socketID){
        this.player2.playerName = playerName
        this.player2.socketID = socketID
    }

    getPlayer2(){
        return this.player2
    }

    getPlayer1(){
        return this.player1
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
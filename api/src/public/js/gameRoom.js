import socket from './socket.js'
const roomID = document.title
const waitingScreen = document.querySelector('#waitingScreen')
const gamePannel = document.querySelector('#gamePannel')
const player1NameDisplay = document.querySelector('#player1NameDisplay')
const player2NameDisplay = document.querySelector('#player2NameDisplay')
socket.username = localStorage.getItem('username')
const houses = []

for(let i = 0 ; i<=8 ; i++){
    const house = document.querySelector(`#house-${i}`)
    house.addEventListener('click', takeHouse)
    house.index = i
    houses[i] = house
}

function takeHouse(event){
    const houseID = event.srcElement.id.split('-')[1]
    const { house, available } = houseVerifier(houseID)
    if(available){
        house.classList += ' marked'
        houses[houseID].marked = true
        houses[houseID].owner = socket.id
        houses[houseID].houseIcon = socket.houseIcon
        socket.emit('renderGame', { houses, roomID })
    }
}

function houseVerifier(houseID){
    const house = houses[houseID]
    if(!house.classList.toString().includes('marked'))
        return { available: true, house }
    return { available: false, house: undefined }
}

function startGame(){
    setTimeout(() =>{
        waitingScreen.classList = 'hidden'
        gamePannel.classList.remove('hidden')
    }, 3000)
}

socket.on('updateGamePannel', housesToRender =>{
    for(let house of housesToRender){
        if(house.marked){
            const {index, owner, houseIcon} = house
            const houseHtmlElement = houses[index]
            houseHtmlElement.innerText = houseIcon
        }
    }
})

socket.on('joinedRoom',  (gameOwner, player2Username) =>{
    player1NameDisplay.innerText = `❌ - Player1: ${gameOwner}`
    socket.houseIcon = socket.username == gameOwner ? '❌' : '⭕'
    if(player2Username){
        player2NameDisplay.innerText = `⭕ - Player2: ${player2Username}`
        startGame()
    }

})

socket.emit('joinGameRoom', { roomID, username : socket.username })
import socket from './socket.js'
const roomID = document.title
const waitingScreen = document.querySelector('#waitingScreen')
const gamePannel = document.querySelector('#gamePannel')
const player1NameDisplay = document.querySelector('#player1NameDisplay')
const player2NameDisplay = document.querySelector('#player2NameDisplay')
socket.username = localStorage.getItem('username')
const houses = []
const htmlHouseElements = []

for(let i = 0 ; i<=8 ; i++){
    const house = document.querySelector(`#house-${i}`)
    house.addEventListener('click', takeHouse)
    htmlHouseElements[i] = house
    houses[i] = {
        index: i,
        marked: false,
        owner: null
    }
}

function takeHouse(event){
    const houseID = event.srcElement.id.split('-')[1]
    const houseStatus = houseVerifier(houseID)
    if(houseStatus.available){
        const house = houses[houseID]
        house.marked = true
        house.owner = socket.id
        house.houseIcon = socket.houseIcon
        socket.emit('renderGame', { house, roomID })
    }else{
        alert('This house is already taken!')
    }
}

function houseVerifier(houseID){
    const house = houses[houseID]
    if(!house.marked){
        return { available: true }
    }else{
        return { available: false }
    }
}

function startGame(){
    setTimeout(() =>{
        waitingScreen.classList = 'hidden'
        gamePannel.classList.remove('hidden')
    }, 3000)
}

socket.on('updateGamePannel', housesFromRender =>{
    for(let house of housesFromRender){
        const htmlHouseElement = htmlHouseElements[house.index]
        htmlHouseElement.innerText = house.houseIcon
        houses[house.index] = house
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

socket.on('userWin', (winner) =>{
    alert(`${winner} won the Tic Tac Toe!`)
    window.location.href = '/'
})

socket.emit('joinGameRoom', { roomID, username : socket.username })
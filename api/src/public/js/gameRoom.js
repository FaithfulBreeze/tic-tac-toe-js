import socket from './socket.js'

const roomID = document.title
const waitingScreen = document.querySelector('#waitingScreen')
const gamePannel = document.querySelector('#gamePannel')
const player1NameDisplay = document.querySelector('#player1NameDisplay')
const player2NameDisplay = document.querySelector('#player2NameDisplay')
socket.username = localStorage.getItem('username')

const houses = []
const htmlHouseElements = []

// dinamicaly adds click events to houses,
// stores houses to array and set houses properties
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

// requesting to join game room
socket.emit('joinGameRoom', { roomID, username : socket.username })

// server response - joined success
socket.on('joinedRoom',  (player1, player2) =>{
    loadPlayers(player1, player2)
    if(player2)
        startGame()
})
// called when joinedRoom receives response and player2 is on room
function loadPlayers(player1, player2){
    // setting user icon
    socket.houseIcon = socket.username == player1 ? '❌' : '⭕'
    // loading players name on waiting screen
    player1NameDisplay.innerText = `❌ - Player1: ${player1}`
    if(player2)
        player2NameDisplay.innerText = `⭕ - Player2: ${player2}`
}
// called when joinedRoom receives response and player2 is on room
function startGame(){
    socket.emit('gameStarted')
    removeWaitingScreen()
    loadPlayersTurnState()
}

// called by startGame()
function removeWaitingScreen(){
    setTimeout(() =>{
        waitingScreen.classList = 'hidden'
        gamePannel.classList.remove('hidden')
    }, 3000)
}

function loadPlayersTurnState(){
    socket.emit('loadPlayersTurnState', roomID)
}

// called when a div is clicked
function takeHouse(clickedDiv){
    const house = getHouseByDiv(clickedDiv)
    const houseStatus = houseVerifier(house)
    if(socket.turn){
        if(houseStatus.available){
            house.marked = true
            house.owner = socket.id
            house.houseIcon = socket.houseIcon
            changePlayersTurn()
            socket.emit('renderGame', { house, roomID })
        }else{
            alert('This house is already taken!')
        }
    }else{
        alert('Not your turn!')
    }
}

// gets the house on houses array by the clicked div
function getHouseByDiv(clickedDiv){
    const houseID = clickedDiv.srcElement.id.split('-')[1]
    return houses[houseID]
}

// verifies if the house is available
function houseVerifier(house){
    if(!house.marked){
        return { available: true }
    }else{
        return { available: false }
    }
}

// changes players turn
function changePlayersTurn(){
    socket.emit('changeTurns', { roomID })
}

// listens to server response of renderGame
socket.on('updateHousesOnClients', housesToRender =>{
    for(let house of housesToRender){
        const htmlHouseElement = htmlHouseElements[house.index]
        htmlHouseElement.innerText = house.houseIcon
        houses[house.index] = house
    }
})

// listens to server response of lastPlayWasFrom
socket.on('updatePlayersOnClients', players =>{
    const { player1, player2 } = players
    if(socket.id == player1.socketID){
        socket.turn = player1.turn
    }else{
        socket.turn = player2.turn
    }
})

// alert who got the first turn
socket.on('firstTurn', player =>{
    setTimeout(() =>{
        alert(`${player} will start the game!`)
    }, 4000)
})

// listens for a winner
socket.on('userWin', (winner) =>{
        setTimeout(() =>{
            alert(`${winner} won the Tic Tac Toe!`)
            window.location.href = '/'
        }, 1000)
})

// listens for draw
socket.on('draw', () =>{
        setInterval(() =>{
            alert(`The game ended with draw!`)
            window.location.href = '/'
        }, 1000)
})


import socket from './socket.js'
const username = document.querySelector('#username')
const room = document.querySelector('#room')
const joinButton = document.querySelector('#joinButton').addEventListener('click', joinRoom)
const createButton = document.querySelector('#createButton').addEventListener('click', createRoom)

function verifyField(field){
    return field.value != false
}

socket.on('availableRooms', (availableRooms) => {
    availableRooms = availableRooms.filter(room => room.isRoomFull == false)
    rooms.innerHTML = `<h1>No rooms yet.</h1>`
    if(availableRooms.length == 0) return rooms.innerHTML = `<h1>No rooms yet.</h1>`
    availableRooms.forEach(room => {
        if(room.isRoomFull) return 
        rooms.innerHTML += `</br><div class="flex justify-between bg-neutral-500 p-3 lg:p-8 text-white text-md lg:text-xl rounded-md"><p>${room.gameOwner}</p></hr><p>${room.roomID}</p></div>`
    })
})

function createRoom(e){
    e.preventDefault()
    if(verifyField(username)){
        localStorage.setItem('username', username.value)
        socket.emit('createRoom', username.value)
    }else{
        alert('Username field is empty!')
    }
}

function joinRoom(e){
    e.preventDefault()
    if(verifyField(username) && verifyField(room)){
        localStorage.setItem('username', username.value)
        socket.emit('joinRoom', room.value)
    }else{
        alert('Please fill out the fields.')
    }
}
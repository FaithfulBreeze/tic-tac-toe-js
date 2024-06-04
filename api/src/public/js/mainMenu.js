import socket from './socket.js'
console.log(socket)
const username = document.querySelector('#username')
const room = document.querySelector('#room')
const joinButton = document.querySelector('#joinButton').addEventListener('click', joinRoom)
const createButton = document.querySelector('#createButton').addEventListener('click', createRoom)

function verifyField(field){
    return field.value != false
}

function createRoom(e){
    e.preventDefault()
    if(verifyField(username)){
        socket.emit('createRoom', username.value)
    }else{
        alert('Username field is empty!')
    }
}

function joinRoom(e){
    e.preventDefault()
    if(verifyField(username) && verifyField(room)){
        socket.emit('joinRoom', {
            username: username.value,
            room: room.value
        })
    }else{
        alert('Please fill out the fields.')
    }
}
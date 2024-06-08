import socket from './socket.js'
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
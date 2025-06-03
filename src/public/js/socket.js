const socket = io()

socket.on('redirect', (roomID) =>{
    window.location.href += roomID
})

export default socket
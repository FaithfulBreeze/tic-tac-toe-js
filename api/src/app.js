const http = require('http')
const {Server} = require('socket.io')
const express = require('express')
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.use(express.static(`${__dirname}/public`))

io.on('connection', socket =>{
    console.log(`Socket connected - ID: ${socket.id}`)
    socket.on('createRoom', (username) =>{
        socket.username = username
    })
    socket.on('joinRoom', ({ username, room }) =>{
        socket.username = username
    })
})



app.use('/', require('./routes/root'))

httpServer.listen(3030)
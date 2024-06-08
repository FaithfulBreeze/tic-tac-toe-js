const router = require('express').Router()
const {join} = require('path')
const handleFullRoom = require('../middlewares/handleFullRoom')
const findGameInstance = require('../middlewares/findGameInstance')

router.get('/', (req, res) =>{
    res.sendFile(join(__dirname, '..', 'public', 'views', 'index.html'))
})

router.get('/rooms/:roomID',findGameInstance, handleFullRoom, (req, res) =>{
    res.sendFile(join(__dirname, '..', 'rooms', req.params.roomID))
})

module.exports = router
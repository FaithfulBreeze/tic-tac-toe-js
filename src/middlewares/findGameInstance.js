const { join } = require('path')
const gameInstances = require('../app')
function findGameInstance(req, res, next){
    const roomID = req.params.roomID.split('.')[0].toString()
    req.gameInstance = gameInstances.find(instance => instance.getRoomID() == roomID)
    if(req.gameInstance == undefined)
        return res.status(401).sendFile(join(__dirname, '..', 'public', 'views', '404.html'))
    next()
}

module.exports = findGameInstance
function handleFullRoom(req, res, next){
    if(req.gameInstance.getIsRoomFull() == true)
        return res.status(401).redirect('/')
    req.gameInstance.handlePlayerJoin()
    next()
}

module.exports = handleFullRoom
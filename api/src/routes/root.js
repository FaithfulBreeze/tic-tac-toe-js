const router = require('express').Router()
const {join} = require('path')

router.get('/', (req, res) =>{
    res.sendFile(join(__dirname, '..', 'public', 'views', 'index.html'))
})

module.exports = router
const express = require('express')
const router = new express.Router()

router.get('/', (req, res, next) => {
    try {
        res.end("Homepage")
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router

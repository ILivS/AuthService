const express = require('express')

const router = new express.Router()

router.post('/logout', async (req, res) => {
    try {
        res.send({success: true, data: true})
    } catch (e) {
        res.status(400).send({e})
    }
})

module.exports = router

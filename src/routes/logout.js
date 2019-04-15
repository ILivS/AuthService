const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/logout',auth, async (req, res) => {
    try {
        jwt.
        res.send({success: true, data: user})
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router

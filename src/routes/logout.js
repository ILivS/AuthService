const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/login', async (req, res) => {
    try {
        const user = await User.confirmCredentials(
            req.body.username,
            req.body.password
        )
        const token = await user.generateToken()
        res.send({success: true, data: user})
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router

const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/login',auth, async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.confirmCredentials(username, password)
        const token = await user.generateToken()
        console.log(token)
        res.status(200).send({success: true, data: user})
    } catch (e) {
        res.status(400).send({e})
    }
})

router.post('/users', async (req, res) => {
    try {
        
        const users = await User.find({})
        res.send({success: true, data: users})
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router

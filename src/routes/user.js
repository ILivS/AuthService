const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const passport = require('passport')

router.post('/users', passport.authenticate('jwt',{session: false}), async (req, res,next) => {
    try 
    {
        console.log(req.user)
        const users = await User.find({})
        res.send({success: true, data: users})
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router

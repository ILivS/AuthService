const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const passport = require('passport')

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            const {message} = info
            if (err || !user) {
                const error = new Error(message)
                return next(error)
            }
            req.login(user, {session: false}, async error => {
                if (error) return next(error)
                // const body = {_id: user._id, email: user.email}
                const token = await user.generateToken()
                return res.json({success: true, token, user})
            })
        } catch (error) {
            return next(error)
        }
    })(req, res, next)
})
/*
router.post('/login', async (req, res) => {
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

*/

module.exports = router

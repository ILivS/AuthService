const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const passport = require('passport')
const {sendSuccess, sendError} = require('../utils/sendResponse')

router.get(
    '/users',
    passport.authenticate('jwt', {session: false}),
    async (req, res, next) => {
        try {
            const users = await User.find({})
            res.send({success: true, data: users})
        } catch (e) {
            res.status(400).send()
        }
    }
)

router.get('/user', async (req, res, next) => {
    passport.authenticate('jwt', {session: false}, async (err, user, info) => {
        try {
            const {message} = info
            if (err ||message || !user) {
                return sendError(res, message)
            }
            const data = {user}
            return sendSuccess(res, data)
        } catch (e) {
            return sendError(res, e)
        }
    })(req, res, next)
})

module.exports = router

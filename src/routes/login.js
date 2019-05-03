const express = require('express')
const router = new express.Router()
const passport = require('passport')
const {sendSuccess, sendError} = require('../utils/sendResponse')

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            const {message} = info
            if (message) {
                return sendError(res, message)
            }
            if (err || !user) {
                return sendError(res, err)
            }
            req.login(user, {session: false}, async error => {
                if (error) return sendError(res, error)
                const token = await user.generateToken()
                const data = {token, user}
                return sendSuccess(res, data)
            })
        } catch (error) {
            return sendError(res, error)
        }
    })(req, res, next)
})

module.exports = router

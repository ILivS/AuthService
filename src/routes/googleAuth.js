const express = require('express')
const router = new express.Router()
const passport = require('passport')
const {sendSuccess, sendError} = require('../utils/sendResponse')
require('dotenv').config()

router.get(
    '/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
)
router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate(
        'google',
        {failureRedirect: '/', session: false},
        async (err, user, info) => {
            try {
                const {message} = info
                if (err || message || !user) {
                    return sendError(res, message)
                }
                const token = await user.generateToken()
                const devURL =
                    process.env.ENV === 'heroku'
                        ? `https://clientlivs.herokuapp.com/auth/google/callback/success?token=${token}`
                        : `http://localhost:3000/auth/google/callback/success?token=${token}`
                const url =
                    process.env.NODE_ENV === 'production'
                        ? `/auth/google/callback/success?token=${token}`
                        : devURL
                res.redirect(url)
            } catch (error) {
                return sendError(res, error)
            }
        }
    )(req, res, next)
})

module.exports = router

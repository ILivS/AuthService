const express = require('express')
const router = new express.Router()
const passport = require('passport')
const {sendSuccess, sendError} = require('../utils/sendResponse')

router.get(
    '/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
)
router.get('/auth/google/callback', (req, res,next) => {
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
            res.redirect(`http://localhost:3000/auth/google/callback/success?token=${token}`)
            }
            catch (error) {
                return sendError(res, error)
            }
        }

    )(req, res, next)
})

module.exports = router

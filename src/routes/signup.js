const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const passport = require('passport')
const {sendSuccess, sendError} = require('../utils/sendResponse')

router.post('/signup', async (req, res) => {
    try {
        const items = ['username', 'password', 'email']
        const emptyString = []
        const info = Object.assign({}, req.body)
        const {username, email} = info
        items.forEach(item => {
            if (!info[item]) emptyString.push(item)
        })

        if (emptyString.length) {
            const message = `${emptyString.join(', ')} cannot be empty`
            return sendError(res, message)
        }

        const user = new User(info)
        const allUsers = await User.find({}).select('email username')
        const users = allUsers.map(item => {
            return item.username
        })
        const emails = allUsers.map(item => {
            return item.email
        })

        if (users.includes(username) || emails.includes(email)) {
            const  message = 'Username or Email already existed'
           return sendError(res,message)
        }
        await user.save()
        return sendSuccess(res, user)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router

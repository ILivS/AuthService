const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/signup', async (req, res) => {
    try {
        const items = ['username', 'password', 'email']
        const emptyString = []
        const info = Object.assign({}, req.body)
        const {username, email, password} = info
        items.forEach(item => {
            if (!info[item]) emptyString.push(item)
        })

        if (emptyString.length)
            return res.status(400).send({
                success: false,
                message: `${emptyString.join(', ')} cannot be empty`
            })

        const user = new User(info)
        const allUsers = await User.find({}).select('email username')
        const users = allUsers.map(item => {
            return item.username
        })
        const emails = allUsers.map(item => {
            return item.email
        })

        if (users.includes(username) || emails.includes(email)) {
           return res.status(400).send({
                success: false,
                message: 'Username or Email already existed'
            })
        }
        await user.save()
        res.send({success: true, data: user})
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router

const express = require('express')
require('./db/mongoose')
require('dotenv').config()

const app = express()
const LoginRoute = require('./routes/login')
const LogoutRoute = require('./routes/logout')
const SignupRoute = require('./routes/signup')

app.use(express.json())
app.use('/api/user', LoginRoute)
app.use('/api/user', SignupRoute)
app.use('/api/user', LogoutRoute)

app.use((req, res, next) => {
    const error = new Error('Page not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app

const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')
require('./db/mongoose')
require('dotenv').config()

const app = express()
const LoginRoute = require('./routes/login')
const LogoutRoute = require('./routes/logout')
const SignupRoute = require('./routes/signup')

app.use(express.json())
app.use(cors())
app.use(logger('dev'))
app.use(helmet())
app.use(passport.initialize())
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

/*
const session = require('express-session')
const redis = require('redis')
const redisClient = redis.createClient()
const redisStore = require('connect-redis')(session)

redisClient.on('error', err => {
    console.log('Redis error: ', err)
})
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        name: '_redis',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: true}, // cookie-parser module is no longer needed
        store: new redisStore({
            host: 'localhost',
            port: 8230,
            client: redisClient,
            ttl: 86400
        })
    })
)
*/
module.exports = app

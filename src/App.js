const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')
const bodyParser = require('body-parser')

require('./middleware/passport')
require('./db/mongoose')
require('dotenv').config()

const app = express()
const LoginRoute = require('./routes/login')
const LogoutRoute = require('./routes/logout')
const SignupRoute = require('./routes/signup')
const UserRoute = require('./routes/user')
const GoogleRoute = require('./routes/googleAuth')

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.use(passport.initialize())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.use(logger('dev'))
app.use(helmet())
app.use('/', GoogleRoute)
app.use('/', LoginRoute)
app.use('/', SignupRoute)
app.use('/', LogoutRoute)
app.use('/', UserRoute)

app.get('/', (req, res, next) => {
    try {
        res.end('Homepage')
    } catch (e) {
        res.status(400).send()
    }
})

app.use((req, res, next) => {
    const error = new Error('Page not found')
    error.status = 404
    res.status(error.status || 500).json({
        success: false,
        error: {
            message: error.message
        }
    })
})

module.exports = app

const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')
require('dotenv').config()

passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await User({username, password})
                return done(null, user)
            } catch (error) {
                done(error)
            }
        }
    )
)

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await User.findOne({username})
                const validate = await user.isValidPassword(password)
                if (!user || !validate) {
                    return done(null, false, {
                        message: 'Wrong username or password!'
                    })
                }
                return done(null, user, {message:''})
            } catch (error) {
                done(error, null, {message: 'Unable to logged in!'})
            }
        }
    )
)

const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use(
    'jwt',
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                const user = await User.findOne({_id: token._id})
                if (!user) return done(null, false, {message: 'User not found'})
                return done(null, user, {message: ''})
            } catch (error) {
                return done(error, null , {message: 'Failed to parsed token!'})
            }
        }
    )
)

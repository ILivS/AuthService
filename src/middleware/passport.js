const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')

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
                if (!user) {
                    return done(null, false, {message: 'User not found'})
                }
                const validate = await user.isValidPassword(password)
                if (!validate) {
                    return done(null, false, {message: 'Wrong Password'})
                }
                return done(null, user, {message: 'Logged in Successfully'})
            } catch (error) {
                return done(error)
            }
        }
    )
)

const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use('jwt',
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                const user = User.find({_id: token._id})
                if (!user) 
                    return done(null,false)
                    return done(null,user)
            } catch (error) {
                done(error)
            }
        }
    )
)

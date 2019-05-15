const passport = require('passport')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const GoogleStrategy = require('passport-google-oauth20').Strategy
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')
const UserDetail = require('../models/userDetail')

require('dotenv').config()

passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
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
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const user = await User.findOne({username})
                const validate = await user.isValidPassword(password)
                if (!user || !validate) {
                    return done(null, false, {
                        message: 'Wrong username or password!',
                    })
                }
                return done(null, user, {message: ''})
            } catch (error) {
                done(error, null, {message: 'Unable to logged in!'})
            }
        }
    )
)

passport.use(
    'jwt',
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                const user = await User.findOne({_id: token._id})
                if (!user) return done(null, false, {message: 'User not found'})
                return done(null, user, {message: ''})
            } catch (error) {
                return done(error, null, {message: 'Failed to parsed token!'})
            }
        }
    )
)

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const {sub, name, given_name, picture, email} = profile._json
                const UserExisted = await User.findOne({email})
                if (UserExisted) {
                    return done(null, UserExisted, {message: ''})
                }
                const userDetail = new UserDetail({
                    googleID: sub,
                    displayName: name,
                    givenName: given_name,
                    picture,
                })
                const user = new User({
                    username: name,
                    email,
                    userDetail: userDetail._id,
                })
                await userDetail.save()
                await user.save()
                return done(null, user, {message: ''})
            } catch (error) {
                return done(error, null, {message: 'Unknown Error!'})
            }
        }
    )
)

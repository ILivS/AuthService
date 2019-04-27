const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate(value) {
                if (value.length < 8) {
                    throw new Error(
                        'Passwords must be at least 8 characters in length'
                    )
                }
            }
        },
        email: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.email
    delete userObject.createdAt
    delete userObject.updatedAt
    return userObject
}

userSchema.methods.isValidPassword = async function (password)  {
    const user = this
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return false
    return true
}

userSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

    return token
}

userSchema.statics.confirmCredentials = async (username, password) => {
    const user = await User.findOne({username})
    if (!user) {
        throw new Error('Username not exist')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        throw new Error('Wrong password!')
    }

    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

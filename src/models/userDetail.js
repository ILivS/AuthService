const mongoose = require('mongoose')
require('dotenv').config()

const userDetailSchema = new mongoose.Schema(
    {
        googleID: {
            type: String
        },
        displayName: {
            type: String
        },
        givenName: {
            type: String
        },
        picture: {
            type: String
        }
    },
    {timestamps: true}
)

userDetailSchema.methods.toJSON = function() {
    const userDetail = this
    const userDetailObject = userDetail.toObject()
    delete userDetailObject.createdAt
    delete userDetailObject.updatedAt
    return userDetailObject
}

const UserDetail = mongoose.model('userDetail', userDetailSchema)

module.exports = UserDetail

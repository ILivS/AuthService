const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(
    process.env.CONNECT_STRING,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
    },
    err => {
        if (!err) {
            console.log('MongoDB connected!')
        }
    }
)

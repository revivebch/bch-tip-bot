const mongoose = require('mongoose')
const UserSchema  = new mongoose.Schema({
    wif: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        useCreateIndex: true
    },
    address: {
        type: String,
        required: true
    },
    ident: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        useCreateIndex: true
    }
})

const Events = mongoose.model('wallet', UserSchema)

module.exports = Events

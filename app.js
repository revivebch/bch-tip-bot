require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()

mongoose.connect(process.env.MONGO_HOST, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('[INFO]','Connected to MongoDB!')).catch((err)=> console.log(err))

app.use('/', require('./routes/api'))

app.listen(process.env.APP_PORT, () => {
    console.log('[INFO]', 'Now listening on '+process.env.APP_PORT)
})

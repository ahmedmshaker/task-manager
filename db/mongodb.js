const mongoose = require('mongoose')


mongoose.connect( process.env.MONGODB_CONNECTION_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true, //make this also true
})
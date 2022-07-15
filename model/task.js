const mongoose = require('mongoose')



const taskScheme = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index:true,
        dropDups: true,
    },
    description: {
        type: String,
        minlength: 10,
        index: true

    },
    completed: {
        type: Boolean,
        default: false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }

},{ timestamps: true})

const Task = mongoose.model('Task', taskScheme)

module.exports = Task
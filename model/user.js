const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: {
            unique: true,
            sparse: true
        },
        validator: (value) => {
            if (!validator.isEmail(value))
                throw Error("Email isn't correct")
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validator: (value) => {
            if (value.toLowerCase().includes('password'))
                throw Error('password is not valid ')
        }

    },
    age: {
        type: Number, min: 18, index: true,
        validate(value) {
            if (value < 18) {
                throw new Error('Age must be a postive number')
            }
        }
    },

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.WEB_TOKEN_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token

}

userSchema.statics.findByCredentails = async (email, password) => {
    const user = await User.findOne({ email:email })
    if (!user) {
        throw Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw Error('unable to login')
    }
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User
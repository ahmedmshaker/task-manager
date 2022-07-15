const User = require('../model/user')
const express = require('express')
const auth = require('../middleware/auth')
const multer = require('multer')

const router = express.Router()


router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.header('Authorization', token).status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {

        const user = await User.findByCredentails(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.header('Authorization', token).status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((userToken) => userToken.token !== req.token)
        await req.user.save()
        res.status(204).send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(204).send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000
    },

})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.status(204).send()

})

router.delete('/users/me/avatar', auth, async (req, res ) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})



module.exports = router
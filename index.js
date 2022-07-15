require('./db/mongodb')
const express = require('express')
const userRouter = require('./services/user_service')
const taskRouter = require('./services/task_service')


const port = process.env.PORT || 3000

const app = express()


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port , ()=>{
    console.log('express is listening to '+port)
})
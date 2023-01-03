const express = require('express')
const app = express()
require('../db/db-connect')
const passport = require('passport')
const session = require('express-session')


app.use(session({secret:"asas"}))
app.use(passport.initialize())
app.use(passport.session())


const userRouter = require('../routes/user-routes')
app.use(express.json())
app.use("/api/user/" , userRouter)









app.all("*" , (req , res) => {
    res.status(404).send({apiStatus: false , message:"invalid URL"})
})



module.exports = app
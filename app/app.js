const express = require('express')
const app = express()
require('../db/db-connect')
const passport = require('passport')
const session = require('express-session')
const userRouter = require('../routes/user-routes')
const blogRouter = require('../routes/blogs-routes')


app.use(session({secret:"asas"}))
app.use(passport.initialize())
app.use(passport.session())


app.use(express.json())
app.use("/api/user/" , userRouter)
app.use("/api/blog/", blogRouter)









app.all("*" , (req , res) => {
    res.status(404).send({apiStatus: false , message:"invalid URL"})
})



module.exports = app
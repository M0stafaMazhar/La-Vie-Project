const router = require('express').Router();
const userControllers = require('../app/controllers/user-controllers')
const {auth} = require('../app/helpers/middleware')
const passport = require('../app/passport')



router.post('/register', userControllers.register)
router.get('/verify/:id', userControllers.verifyEmail)
router.get('/login', userControllers.login)
router.put('/logout' , auth , userControllers.logout)
router.get('/login/google' , passport.authenticate("google" , {scope:["profile" , "email"]})  )
router.get('/login/google-redirect' , passport.authenticate("google") , (req, res) => {
    res.send(req.user)
})


router.get('/test', auth ,(req , res) => {
    res.send('test')
})


module.exports = router
const router = require('express').Router();
const userControllers = require('../app/controllers/user-controllers')
const {auth} = require('../app/helpers/middleware')
const passport = require('../app/passport')
const upload = require('../app/controllers/file-upload')


//Authntication
router.post('/register', userControllers.register)
router.get('/verify/:id', userControllers.verifyEmail)

router.get('/login', userControllers.login)
router.put('/logout' , auth , userControllers.logout)

router.get('/login/google' , passport.authenticate("google" , {scope:["profile" , "email"]})  )
router.get('/login/google-redirect' , passport.authenticate("google") , userControllers.socialLogin)

router.get('/login/facebook' , passport.authenticate("facebook" , {scope:['email']})  )
router.get('/login/facebook-redirect' , passport.authenticate("facebook") , userControllers.socialLogin)

router.get("/forgot-password" , userControllers.forgotPassword)
router.put('/reset-password', userControllers.resetPassword)


//profile
router.get('/my-profile', auth , userControllers.myProfile)
router.get('/profile/:id', userControllers.profile)

router.put("/edit-profile" , auth , userControllers.editMe)

router.post("/add-image" , auth , upload.single("avatar") , userControllers.uploadImage)

router.get("/orders" , auth , userControllers.orders)
router.get("/shoping-cart" , auth , userControllers.shopingCart)
router.get("/my-points" , auth , userControllers.points)


router.get("/my-blogs" , auth , userControllers.myBlogs)
router.get("/blogs/:id" , userControllers.userBlogs)






router.get('/test', auth ,(req , res) => {
    res.send('test')
})


module.exports = router

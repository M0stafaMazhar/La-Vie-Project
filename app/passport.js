const passport = require('passport')
const googleStrategy = require('passport-google-oauth20')

const userModel = require('../db/models/user-model')

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user , done)=>{

    
        done(null, user)
    
})


passport.use(new googleStrategy({
    callbackURL: "/api/user/login/google-redirect",
    clientID: "111610478443-armoc1bvtk4jg6adg0k89bt4p384nmqh.apps.googleusercontent.com",
    clientSecret: "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"
}, async (accessToken , refreshToken , profile, done)=>{
    try{
    // console.log(email)
    console.log(profile);
    const user = await userModel.findOne({googleId: profile.id})
    if(user) {
        done(null , user)
    }else{
    const userData = new userModel({
        fName: profile.name.givenName,
        lName: profile.name.familyName,
        googleId : profile.id,
        email: profile.emails[0].value,
    })

    await userData.save()
        done(null , userData)
    }
}
    catch(err){
        console.log(err)
        done(err , null)
    }})
)



module.exports = passport
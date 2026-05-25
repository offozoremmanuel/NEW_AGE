const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const customerModel = require('../models/customer')

const googleOAuthIsConfigured = process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

if (googleOAuthIsConfigured) {
  passport.use(new GoogleStrategy({
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
  async(accessToken, refreshToken, profile, cb) => {
      try {
          console.log(profile)
          let user = await customerModel.findOne({email: profile._json.email})

          if(!user){
              const [firstName, ...lastNameParts] = (profile._json.name || '').split(' ');

              user = new customerModel({
                  firstName: profile._json.given_name,
                  lastName: profile._json.family_name,
                  email:profile._json.email,
                  googleId: profile.id,
                  isVerified:profile._json.email_verified,
                  profilePicture: profile._json.picture
              })
              await user.save()
          }
          return cb(null, user)
      } catch (error) {
          console.log('error signing up with google', error.message)
          return cb(error)
      }
    }
  ));
}

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await customerModel.findById(id);

        if (!user){
            return cb(new Error('user not found'), null)
        }
        cb(null, user);
    } catch (error) {
        cb(error, null);
    }
});

const googleOAuthNotConfigured = (req, res) => {
  res.status(503).json({
    message: 'Google OAuth is not configured'
  })
}

const profile = googleOAuthIsConfigured
  ? passport.authenticate('google', {scope:  ['profile', 'email']})
  : googleOAuthNotConfigured

const loginProfile = googleOAuthIsConfigured
  ? passport.authenticate('google', {failureRedirect:'/login'})
  : googleOAuthNotConfigured

module.exports ={
    passport,
    profile,
    loginProfile
}

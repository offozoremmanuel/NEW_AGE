const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const customerModel = require('../models/customer');

const googleOAuthIsConfigured = process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL;

if (googleOAuthIsConfigured) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            let customer = await customerModel.findOne({ email: profile._json.email });

            if (!customer) {
                customer = await customerModel.create({
                    firstName: profile._json.given_name || profile._json.name || 'Google',
                    lastName: profile._json.family_name || 'Customer',
                    email: profile._json.email,
                    googleId: profile.id,
                    isVerified: profile._json.email_verified,
                    profilePicture: {
                        secureUrl: profile._json.picture
                    }
                });
            }

            return done(null, customer);
        } catch (error) {
            console.log(error.message || error);
            return done(error);
        }
    }));
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const customer = await customerModel.findById(id);
        done(null, customer);
    } catch (error) {
        done(error);
    }
});

const googleOAuthNotConfigured = (req, res) => {
    res.status(503).json({
        message: 'Google OAuth is not configured'
    });
};

const profile = googleOAuthIsConfigured
    ? passport.authenticate('google', { scope: ['profile', 'email'] })
    : googleOAuthNotConfigured;

const loginProfile = googleOAuthIsConfigured
    ? passport.authenticate('google', { failureRedirect: '/api/v1/customer/loginfailed' })
    : googleOAuthNotConfigured;

module.exports = {
    passport,
    profile,
    loginProfile
};

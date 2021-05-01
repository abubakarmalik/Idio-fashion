// // require install moudels
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');

// require app files
const Googleuser = require('../models/usersModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    Googleuser.findById(id).then((user) => {
        done(null, user.id);
    });
});

passport.use(new googleStrategy({
    // select options for goolge
    callbackURL: '/users/google/redirect',
    clientID: '869513626913-iaqhvu3a8uk9v81sqbem96fq27ve7kjj.apps.googleusercontent.com',
    clientSecret: 'w2kEV3gqGsczpABBhCbIeTnm'
}, (accessToken, refreshToken, profile, done) => {
    // passport callbacks
    Googleuser.findOne({ googleid: profile.id }).then((currentUser) => {
        if (currentUser) {
            // check user in db
            console.log('user alredy saved' + currentUser);
            done(null, currentUser);
        } else {
            new Googleuser({
                name: profile.displayName,
                googleid: profile.id
            }).save().then((newUser) => {
                console.log('user is created' + newUser);
                done(null, newUser);
            });
        }
    });
})
);


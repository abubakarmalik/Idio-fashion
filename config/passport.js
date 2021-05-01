// require install moudels
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// require app files
const usersModel = require("../models/usersModel");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      usersModel.findOne({
        email: email
      }).then(user => {
        if (!user.active) {
          return done(null, false, { message: 'Your Account not activated' });
        }
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    usersModel.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

// require moudels
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const async = require('async');
const crypto = require('crypto');

// require app files
const usersModel = require("../models/usersModel");
const User = require('../models/usersModel');

module.exports = {

  //Render the register
  register: async (req, res) => await res.render('register'),

  //Handel the post request for register
  createUser: (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      usersModel.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new usersModel({
            name,
            email,
            password
          });
          // hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              // if (err) throw err;
              newUser.password = hash;
              // send activation link
              temporarytoken = jwt.sign({ id: newUser._id }, 'aex', { expiresIn: '24h' });
              newUser.temporary = temporarytoken;
              newUser.save(err => {
                if (err) {
                  console.log(err);
                } else {
                  var smtpTransport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    service: 'gmail',
                    auth: {
                      user: 'nodestore.1100@gmail.com',
                      pass: 'malik.123'
                    }
                  });
                  var mailOptions = {
                    to: newUser.email,
                    from: '"Idio Fashion" <nodestore.1100@gmail.com>',
                    subject: 'Account Confirmation Link',
                    text:
                      'Please click on the following link, to Confirm your Account:\n\n' +
                      'http://' + req.headers.host + '/users/activate/' + newUser.temporary + '\n\n' +
                      'If you did not request this, please ignore this email..\n'
                  };
                  smtpTransport.sendMail(mailOptions, function (err) {
                    console.log('Account Confrimation link send');
                  });
                  res.render('register', {
                    success_msg:
                      'Your Account has been registed but not activated yet check email to activate the Account'
                  });
                }
              });
            });
          });
        }
      });
    }
  },

  // handle the Account activation request
  activate: (req, res) => {
    usersModel.findOne({ temporary: req.params.temporarytoken }, (err, user) => {
      const token = req.params.temporarytoken;
      console.log(token);
      jwt.verify(token, 'aex', (err, decoded) => {
        if (err) {
          console.log(err);
          err = "Activation Token is Invalid or Expired...";
          res.render('register', { 'err': err });
        }
        if (!token) {
          console.log(token);
          err = "Activation Token is Invalid or Expired...";
          res.render('register', { 'err': err });
        }
        if (!user) {
          console.log(token);
          err = "Activation Token is Invalid or Expired...";
          res.render('register', { 'err': err });
        }
        if (!decoded) {
          console.log(decoded);
          err = "Activation Token is Invalid or Expired...";
          res.render('register', { 'err': err });
        } if (decoded) {
          user.active = true;
          user.temporary = false;
          user.save();
          req.flash('success_msg', 'Your Account Activated');
          res.redirect('/users/login');
        }
      });
    });
  },

  // render the login
  login: async (req, res) => await res.render('login'),

  // handle the post request for login
  loginUser: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  },

  // handle get request for forgot 
  forgot: async (req, res) => await res.render('forgot'),

  // handle post request for forgot password
  forgotPass: (req, res, next) => {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        usersModel.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 18000000;

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          service: 'gmail',
          auth: {
            user: 'nodestore.1100@gmail.com',
            pass: 'malik.123'
          }
        });
        var mailOptions = {
          to: user.email,
          from: '"Idio Fashion" <nodestore.1100@gmail.com>',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log('Rest link send');
          done(err, 'done');
        });
      }
    ], function (err) {
      if (err) return next(err);
      req.flash('success_msg', 'Reset link snend on your email, please check!');
      res.redirect('/users/forgot');
    });
  },

  //handle get request for reset password
  reset: (req, res) => {
    usersModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/users/forgot');
      }
      //token: req.params.token;
      //res.redirect(`/users/reset/url?token=${req.params.token}`);
      res.render('reset', { token: req.params.token });
    });
  },

  //handle the post request for reset password
  restPass: async (req, res) => {
    usersModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async (err, user) => {
      if (err) throw err;
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.render('reset');
      }
      if (req.body.password == null || req.body.C_password == '') {
        req.flash('error', 'Password not Provided');
        return res.render('reset');
      }
      if (req.body.password != req.body.C_password) {
        req.flash('error', 'Password not match');
        return res.render('reset');
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashpasswd = await bcrypt.hash(req.body.password, salt);
        user.password = hashpasswd;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        const saveUser = await user.save(function (err) {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            var smtpTransport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'nodestore.1100@gmail.com',
                pass: 'malik.123'
              }
            });
            var email = {
              from: '"Idio Fashion" <nodestore.1100@gmail.com>',
              to: user.email,
              subject: 'Reset Password',
              text: 'Hi ' + user.name + ', This e-mail is to notify you that your password was recently reset at localhost.com',
              html: 'Hi<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com'
            }
            //console.log('Password has been changed');
            smtpTransport.sendMail(email, function (err) {
              console.log('Password has been changed');
              done(err);
            });
            req.flash('success_msg', 'Success! Your password has been changed.');
            res.redirect('/users/login');
          }
        })
      }
    });
  },

  // handle google authenticaton request
  googleAuth: (req, res) => {
    res.redirect('/dashboard')
  },

  // handle logout request
  logout: (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  },

}



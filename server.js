// require install moudels
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieSession = require('cookie-session');

// require app files
require('./config/passport')(passport);
const { mongoose } = require('./config/db');
const index = require('./routes/index');
const users = require('./routes/users');
const googleStrategy = require('./config/googleStrategy');

// create express app
var app = express();

// setup ejs engine
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// cookie session
app.use(cookieSession({
  maxAge: 60 * 24 * 60 * 60 * 1000, // 2 month
  keys: ['iamaexdeveloper']
}));

//body-parser for handle post the data
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Falsh Masseges
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// create app routes
app.use('/', index);
app.use('/users', users);

// creating web server
var port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => console.log(`listening on port ` + port));


//export all modules
module.exports = {
  // autentication check funtions
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that local resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },
  checkGoogleAuth: (req, res, next) => {
    if (!req.user) {
      req.flash('error_msg', 'Please log in to view that google resource');
      res.redirect('/users/login');
    } else {
      return next();
    }
  }
};

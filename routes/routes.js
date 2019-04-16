const express = require('express');
const passport = require('../config/passport');
const user = require('../models/users');
const router = express.Router();
//==============================================================================

//protect routes that only logged in users should see (only /profile for this test)
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

// passport middleware
router.use(passport.initialize());
router.use(passport.session());

// Routes ============================
/*
* Index page
*/
router.get('/', function (req, res) {
  res.render('index', { title: 'Express Coding Challenge', heading: 'Welcome' })
});

/*
* Simple login page
*/
router.get('/login', function (req, res) {
  return res.render('login', { title: 'Express Coding Challenge', heading: 'Sign Up or Sign In' });
});
/*
* Because they said to use this endpoint for POST :)
*/
router.post('/users/signin', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        if (req.xhr) {return res.json({'status': 'error', 'data' : { 'title' : info.errMsg }});}
        return res.status(409).render('login', {errMsg: info.errMsg});
      }
      req.login(user, function(err){
        if(err){
          console.error(err);
          return next(err);
        }
        if (req.xhr) {return res.json({'status': 'success', 'data' : null});}
        return res.redirect('/profile');
      });
    })(req, res, next);
  });
/*
* Basic passport signup. User must have an email domain that matches an existing instituion.
* Default role is "student". Route was specified in challenge.
*/
router.route('/users/create')
  .get(function (req, res) {
    return res.render('signup');
  })
  .post(function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        if (req.xhr) {return res.json({'status': 'error', 'data': { 'title': info.message }});}
        return res.status(409).render('signup', {errMsg: info.message});
      }
      req.login(user, function(err){
        if(err){
          return next(err);
        }
        return res.redirect('/profile');
      });
    })(req, res, next);
  });

/*
* Profile page can only be viewed by logged in user. Shows books available with from the institution
* the the user is associated with.
*/
router.get('/profile', isLoggedIn, function (req, res) {
  user.listUserRoles(req.user._id, function (err, roles) {
    if (err) {
      return res.render('profile', {});
    }
    return res.render('profile', {
      title: 'Express Coding Challenge',
      heading: 'My Profile',
      username: req.user.username,
      email: req.user.email,
      roles: roles.roles[0].title //only one for now
      });

  });

});
/*
* Logs the user out.
*/
router.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy();
  return res.redirect('/');
});

/*
* Get the full user list (no paging, not protected)
*/
router.get('/users', function (req, res, next) {
  res.render('listusers', { title: 'Express Code Challenge', heading: 'User List' })
})

// API Routes (JSON) ==========================================
// N.b. except for the requested "/books" endpoint, these APIs aren't protected and would
// normally be accessible only to authenticated users of a specific role (e.g., admin)
/*
* Gets books for the current user
*/
router.get('/books', isLoggedIn, function (req, res, next) {
  user.getUserBooks(req.user.id, function (err, result) {
    var resjson = {
      status: 'success',
      data: {'title': 'books', 'books': result.books}
    }
    res.json(resjson);
  });
})
/*
* Gets all users
*/
router.get('/api/users', function (req, res, next) {
  user.listAllUsers(function (err, result) {
    res.json(result)
  });
})
/*
* Get the books available to the specified user via their instituion (admin only)
*/
router.get('/api/user/:id/books', function (req, res, next) {
  user.getUserBooks(req.params.id, function (err, result) {
    res.json(result)
  });
})

// End API Routes ==============================================================

module.exports = router;

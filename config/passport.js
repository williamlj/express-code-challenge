const passport = require('passport');
const User = require('../models/users');
const Role = require('../models/roles');

const host = 'localhost';
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      console.error('Error in findById');
      return console.log(err.message);
    }
    return done(null, user);
  })
});

//Passport Strategies
//====================
// Local signup
passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({email: email}, function(err, user) {
        if(err) {
          return console.error(err.message);
        }
        if(user) {
          console.log('user already exists');
          return done(null, false, {message: 'That email already exists'});
        }
        else {
            Role.findOne({}).then(function (role) {
              var newUser = new User();
              newUser.username = req.body.username;
              newUser.email = email;
              newUser.password = newUser.generateHash(password);
              newUser.roles = [role._id];
              newUser.save(function(err) {
                if(err) {
                  if(err.message.includes('User validation failed')) {
                    return done(null, false, {message: 'Please fill all fields'});
                  }
                  if(err.message == 'No matching institution') {
                    return done(null, false, {message: 'No matching institution found for ' + email.split('@')[1] + '. Check your email address.'});
                  }
                  return console.error(err.message);
                  }

                console.log('New user successfully created...', newUser.username, newUser.email);
                return done(null, newUser);
              });
            });
          }
      });
    });
}));

// Local login
passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({email: email}, function(err, user) {
            if(err) {
              return console.error(err.message);
              }
            if(!user) {
              return done(null, false, {errMsg: 'User does not exist.'});
              }
            if(!user.validPassword(password)) {
              return done(null, false, {errMsg: 'Invalid password.'});
              }
            return done(null, user);
        });

}));

module.exports = passport;

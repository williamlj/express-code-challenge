//users.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Role = require("./roles");
const Institution = require('./institutions');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  institution_id: {type : mongoose.Schema.ObjectId, ref : 'Institution'},
  roles: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Role"
    }
  ],
  created_on: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


userSchema.pre('save', function(next) {
  let user = this;
  var email_domain = this.email.split('@')[1];
  Institution.findOne({'email_domain': email_domain}).exec(function (err, institution) {
    if (!institution) {
      const err = new Error('No matching institution');
      next(err);
    }
    if (err) {
      next(new Error('something went wrong'));
    }
    if (institution) {
      user.institution_id = mongoose.Types.ObjectId(institution._id);
      next();
    }
  });

});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.listAllUsers = (callback)  => {
  User.find({}, { password: 0 }).populate({ path: 'roles'}).exec(callback);
}

module.exports.listUserRoles = (id, callback)  => {
  User.findById(id, 'roles').populate({ path: 'roles'}).exec(callback);
}
module.exports.getUserBooks = (id, callback) => {
  User.findById(id, function (err, user) {
    if (!user) {
      callback('No user found for id: ' + id);
    }
    Institution.findById(user.institution_id).populate({ path: 'books',}).exec(callback);
  });
}

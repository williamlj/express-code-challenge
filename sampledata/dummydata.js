const requireDirectory = require('require-directory');
const models = requireDirectory(module, '../models'); //get all the models
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const uuid = require('uuid')
const bcrypt = require('bcrypt-nodejs');

var names = require('./names.js');
var institution_data = require('./institutions.js');
var book_data = require('./books.js');

function getRandomBooks () {
  models.books.findRandom({}, {}, {limit: 3}, function(err, results) {
    if (err) {
      console.log(err); // 5 elements
    }
    //console.log(results.map(function(_) {return _._id}));
    return results.map(function(_) {return _._id});
  });
}

var institutions = institution_data.institutions.map(function(_) {
  return {
    name: _.name,
    email_domain: _.domains[0].toLowerCase(),
    url: _.web_pages[0]
  }
});



var roles = ['student', 'academic', 'administrator'].map(function(_) {
  return {
    _id: new ObjectId(),
    title: _
  }
});

var books = book_data.books.map(function(_) {
  return {
    _id: new ObjectId(),
    isbn: _.isbn || _.title,
    title: _.title,
    author: _.authors.filter(Boolean),
    thumbnailUrl: _.thumbnailUrl
  }
});


/*
* Generate dummy data. First books and then institutios, and randomly assign some
* books to each institution. Also create roles and then users and assign roles
*/
module.exports.generateData = (callback)  => {

  models.books.create(books).then(function (b) {
    console.log('created books');
    models.institutions.create(institutions).then(function (i) {
        console.log('created institutions');

        i.forEach(function (record) {
          var unique_ids = [];
          while (unique_ids.length < 100) { //assign 100 random books to each institution
          var random_number = Math.floor(Math.random() * b.length);
            if (unique_ids.indexOf(random_number) == -1) {
                unique_ids.push( b[random_number]._id );
            }
          }
          record.books = unique_ids;
          record.save();
        });

        models.roles.create(roles).then(function (record) {
          console.log('Created roles');
          var users = names.names.map(function(_) {
            var emaildomain = institution_data.institutions[Math.floor(Math.random() * Math.floor(institution_data.institutions.length))].domains[0].toLowerCase();
            return {
              email: _.toLowerCase() + '@' + emaildomain,
              username: _ + ' ' + names.surnames[Math.floor(Math.random() * Math.floor(names.surnames.length))],
              password: bcrypt.hashSync('demo', bcrypt.genSaltSync(8), null),
              roles: [ObjectId(record[0]._id)],
              institution_id: null
            }
          });

          models.users.create(users, function(){
            console.log('created users');
          });
        });

    });
  });







}

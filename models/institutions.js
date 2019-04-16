//institution.js
const mongoose = require('mongoose');
const institutionSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  email_domain: {
    type: String,
    unique: true,
    required: true
  },
  url: {
    type: String,
    unique: true,
    required: true
  },
  books: [ {type : mongoose.Schema.ObjectId, ref : 'Book'} ]
});

const Institution = module.exports = mongoose.model('Institution', institutionSchema);

module.exports.listAllInstitutions = (callback) => {
  Institution.find({}).populate({ path: 'books',}).exec(callback);
}

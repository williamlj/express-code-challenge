//book.js
const mongoose = require('mongoose');
const random = require('mongoose-simple-random');

const bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  isbn: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    unique: false,
    required: true
  },
  author: {
    type: [String],
    unique: false,
    required: true
  },
  thumbnailUrl: {
    type: String,
    unique: false,
    required: false
  }
});
bookSchema.plugin(random);

const Book = module.exports = mongoose.model('Book', bookSchema);

module.exports.listAllBooks = (callback)  => {
  Book.find({}, callback);
}

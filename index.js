const express = require('express');
const path = require('path');
const bParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const router = require('./routes/routes');

const app = express();
app.set('json spaces', 2);
app.set('view engine', 'pug');
app.use(express.static('public'));

app.use(bParser.json());
app.use(bParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'nobodywilleverguessthis',
    resave: false,
    saveUninitialized: false
}));
//just a quick test to load some data so we can see something
const dummydata = require('./sampledata/dummydata.js')
//db stuff
mongoose.connect('mongodb://127.0.0.1:27017/test');
mongoose.connection.on('error', function (err) {
  console.error('There was a db connection error');
  return  console.error(err.message);
});
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
  // Reset database for each demo
  const db = mongoose.connection;
  db.collection('users').drop();
	db.collection('books').drop();
  db.collection('institutions').drop();
  db.collection('roles').drop();
  console.log('Creating test data.... (books, institutions, roles, users)');
  dummydata.generateData(function(err) {
    if (err) { return console.log(err) }
  });
});

app.use('/', router);
module.exports = app; //for tests
//start the server
app.listen(3000, () => console.log(`Open http://localhost:3000 to see a response.`));

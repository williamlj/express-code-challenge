const should = require('should');
const request = require('supertest');
const faker = require('faker');
const app = require('../index');
const User = require('../models/users');


describe('Users', function () {
  before(function (done) {
    User.remove({}, done);
  });
  describe('Create User pass', function () {
    it('Should create a new valid user', function (done) {
      this.timeout(10000);
      request(app)
      .post('/users/create')
      .send({
        username: 'Jane Doe',
        email: 'janedoe@ox.ac.uk', //Oxford
        password: 'secret1234'
      })
      .expect(302)
      .end(function (err, res) {
        res.text.should.containEql('/profile');
        done(err);
      })
    })
  });
  describe('Logout pass', function () {
    it('Should log out user', function (done) {
      request(app)
      .get('/logout')
      .expect(302)
      .end(function (err, res) {
        res.text.should.containEql('Redirecting to /');
        done(err);
      })
    })
  });
  describe('Login pass', function () {
    it('Should log in valid user', function (done) {
      request(app)
      .post('/users/signin')
      .send({
        email: 'janedoe@ox.ac.uk',
        password: 'secret1234'
      })
      .expect(302)
      .end(function (err, res) {
        res.text.should.containEql('Redirecting to /profile');
        done(err);
      })
    })
  });
  describe('Signup fail', function () {
    it('Should fail because of missing username', function (done) {
      request(app)
      .post('/users/create')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
      .expect(409)
      .end(function (err, res) {
        done(err);
      })
    })
  });
  describe('Signup fail', function () {
    it('Should fail because of missing password', function (done) {
      request(app)
      .post('/users/create')
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email()
      })
      .expect(409)
      .end(function (err, res) {
        done(err);
      })
    })
  });
  describe('Signup fail', function () {
    it('Should fail because of missing email', function (done) {
      request(app)
      .post('/users/create')
      .send({
        username: faker.internet.userName(),
        password: faker.internet.password()
      })
      .expect(409)
      .end(function (err, res) {
        done(err);
      })
    })
  });
  describe('Signup fail', function () {
    it('Should fail because of no matching institution', function (done) {
      request(app)
      .post('/users/create')
      .send({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email()
      })
      .expect(409)
      .end(function (err, res) {
        done(err);
      })
    })
  });
  describe('Signup fail', function () {
    it('should fail because of existing user', function (done) {
      request(app)
      .post('/users/create')
      .send({username: 'Jane Doe',
      email: 'janedoe@ox.ac.uk',
      password: 'secret1234'
      })
      .expect(409)
      .end(function (err, res) {
        done(err);
      })
    })
  });
})

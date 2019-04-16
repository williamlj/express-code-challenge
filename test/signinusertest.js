const should = require('should');
const request = require('supertest');
const faker = require('faker');
const app = require('../index');
const User = require('../models/users');

describe('Sign in', function () {
  before(function (done) {
    User.remove({}, done);
  });
  describe('Sign in fail', function () {
    it('Should reject an invalid user with 409 status', function (done) {
      request(app)
      .post('/users/signin')
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
  describe('Sign in fail', function () {
    it('Should reject user because of wrong password', function (done) {
      request(app)
      .post('/users/signin')
      .send({
        email: 'janedoe@ox.ac.uk',
        password: faker.internet.password()
      })
      .expect(409)
      .end(function (err, res) {
        done(err);
      })
    })
  });
  describe('Sign in fail', function () {
    it('Should reject user because of wrong username', function (done) {
      request(app)
      .post('/users/signin')
      .send({
        email: 'janedoesnot@ox.ac.uk',
        password: faker.internet.password()
      })
      .expect(409)
      .end(function (err, res) {
        done(err);
      })
    })
  });
})

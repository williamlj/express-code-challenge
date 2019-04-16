const should = require('should');
const request = require('supertest');
const faker = require('faker');
const app = require('../index');
const User = require('../models/users');

describe('Profile', function () {
  it('Should reject unauthenticated user', function (done) {
    request(app)
    .get('/profile')
    .send({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    .expect(302)
    .end(function (err, res) {
      res.text.should.containEql('Redirecting to /login');
      done(err);
    })
  })
})

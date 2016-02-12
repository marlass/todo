'use strict';

process.env.NODE_ENV = 'test';

const test = require('tape');
const app = require('./../app/app');
const request = require('supertest');


test('return welcome message', function (t) {
    request(app)
    .get('/')
    .expect(200)
    .end(function(err, result){
        t.error(err, 'No errors');
        t.equal(result.text, 'Hello! Welcome in our API', 'Returns hello');
        t.end();
    });
})

test('get /users', function (t) {
    request(app)
    .get('/users')
    .expect(200)
    .end(function(err, result){
        t.error(err, 'No errors');
        t.equal(result.text, '[]', 'Empty user list');
        t.end();
        process.exit(0);
    });
})
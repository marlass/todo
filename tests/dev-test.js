'use strict';

process.env.NODE_ENV = 'development';

const test = require('tape-catch');
const app = require('./../app/app');
const request = require('supertest');

test('return welcome message and log request', function (t) {
    request(app)
    .get('/')
    .expect(200)
    .end(function(err, result){
        t.error(err, 'No errors');
        t.equal(result.text, 'Hello! Welcome in our API', 'Returns hello');
        t.end();
    });
})                         
 
test.onFinish(function(){ 
    process.exit(0);
});
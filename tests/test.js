'use strict';

process.env.NODE_ENV = 'test';

const test = require('tape');
const app = require('./../app/app');
const request = require('supertest');
const mongoose = require('mongoose');
const config = require('./../app/config');
const async = require('async');


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
    async.series([
        function(callback){
            request(app)
            .get('/users')
            .expect(200)            
            .expect('Content-Type', 'application\/json; charset=utf-8')
            .end(function(err, result){
                t.error(err, 'No errors');
                t.equal(result.text, '[]', 'Empty user list');
                callback(null, 'done');
            });            
        },
        function(callback){
            request(app)
            .post('/users')
            .send({ name: 'Test', mail: 'test@test.com', password: 'test' })
            .expect(200)
            .end(function(err, result){
                t.error(err, 'No error while adding test user');
                t.equal(result.body, true, 'Return true');
                callback(null, 'done');
            });
        },
        function(callback){
            request(app)
            .get('/users')
            .expect(200)            
            .expect('Content-Type', 'application\/json; charset=utf-8')
            .end(function(err, result){
                t.error(err, 'No errors');
                t.notEqual(result.text, '[]', 'User on list');
                t.end();
                callback(null, 'done');
            });
        }
    ]);    
})

test('authentication', function(t){
    request(app)
    .post('/authenticate')
    .send({"name": "yolo"})
    .expect(200)
    .end(function(err, result){
        t.error(err, 'No errors');
        t.equal(result.text, '{\"success\":false,\"message\":\"Authentication failed. User not found.\"}');
        t.end();
    });
})

test.onFinish(function(){    
    mongoose.connect(config.database, function(){
        mongoose.connection.db.dropDatabase();                
        process.exit(0);
    });
});
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
                const newUser = JSON.parse(result.text);                        
                t.equal(newUser.mail, 'test@test.com', 'Return user');
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
    });
    request(app)
    .post('/authenticate')
    .send({"name": "Test"})
    .expect(200)
    .end(function(err, result){
        t.error(err, 'No errors');
        t.equal(result.text, '{\"success\":false,\"message\":\"Authentication failed. Wrong password.\"}');
        t.end();
    });
})

test('addUser', function(t){
    const user = require('./../app/models/user');
    user.add({ name: 'Test', mail: 'test@test.com' }, function(err, result){
        t.equal(err.errors.password.kind, "required", "Password required error");
    })
    user.add({ name: 'Test', mail: 'test@test', password: 'test' }, function(err, result){
        t.equal(err.errors.mail.kind, "user defined", "Wrong email");
    })
    user.add({ name: 'Tests', mail: 'test@test.com', password: 'test' }, function(err, result){
        t.equal(err.errors.mail.kind, "Duplicate value", "Duplicate email");
    })
    user.add({ name: 'Test', mail: 'test@test.pl', password: 'test' }, function(err, result){
        t.equal(err.errors.name.kind, "Duplicate value", "Duplicate name");
        t.end();
    })
})

test('addUser route error printing', function(t){
    request(app)
    .post('/users')
    .send({ name: 'Test', mail: 'test@test.com', password: 'test' })
    .expect(400)
    .end(function(err, result){
        const errors = JSON.parse(result.text);                        
        t.equal(errors.errors.name.kind, 'Duplicate value', 'Error returned');
        t.end();
    });    
})

test.onFinish(function(){    
    mongoose.connect(config.database, function(){
        mongoose.connection.db.dropDatabase();                
        process.exit(0);
    });
});
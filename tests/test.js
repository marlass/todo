'use strict';

process.env.NODE_ENV = 'test';

const test = require('tape');
const app = require('./../app/app');
const request = require('supertest');
const mongoose = require('mongoose');
const Config = require('./../app/config');
const user = require('./../app/models/user');
let token = '';
let config = new Config();
const async = require('async');

test('test config', function(t){
    process.env.NODE_ENV = 'test';
    config = new Config();
    t.ok(typeof config.database !== 'undefined', 'Set test db');
    t.ok(typeof config.secret !== 'undefined', 'Set test secret');
    process.env.NODE_ENV = 'development';
    config = new Config();
    t.ok(typeof config.database !== 'undefined', 'Set development db');
    t.ok(typeof config.secret !== 'undefined', 'Set development secret');
    process.env.NODE_ENV = 'production';
    config = new Config();
    t.ok(typeof config.database !== 'undefined', 'Set production db');
    t.ok(typeof config.secret !== 'undefined', 'Set production secret');
    process.env.NODE_ENV = 'bla';
    config = new Config();
    t.ok(typeof config.database !== 'undefined', 'Set db');
    t.ok(typeof config.secret !== 'undefined', 'Set secret');
    process.env.NODE_ENV = 'test';
    config = new Config();
    t.end();
})


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

test('add user', function(t){
    user.add({ name: 'Test', mail: 'test@test.com', password: 'test' }, function(err, res){
        t.error(err, 'No error while adding test user');
        t.equal(res.mail, 'test@test.com', 'Return user');
        t.end();
    })    
})

test('authentication - no user', function(t){
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
test('authentication - success', function(t){
    request(app)
    .post('/authenticate')
    .send({"name": "Test", "password": "test"})
    .expect(200)
    .end(function(err, result){
        t.error(err, 'No errors');        
        const res = JSON.parse(result.text); 
        token = res.token;   
        t.equal(res.success, true, 'Logged - token given');
        t.end();
    });
})
test('authentication - wrong password', function(t){ 
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

test('get /users', function (t){
    request(app)
    .get('/users')
    .set('x-access-token', token)
    .expect(200)            
    .expect('Content-Type', 'application\/json; charset=utf-8')
    .end(function(err, result){
        t.error(err, 'No errors');
        t.notEqual(result.text, '[]', 'User on list');
        t.end();
    }); 
})

test('get /users/username', function(t){
    request(app)
    .get('/users/Test')
    .set('x-access-token', token)
    .expect(200)
    .expect('Content-Type', 'application\/json; charset=utf-8')
    .end(function(err, result){
        t.error(err, 'No errors');
        const user = JSON.parse(result.text);
        t.equal(user.mail, 'test@test.com', 'User returned')
        t.end();
    })
})

test('get /users/username - wrong username', function(t){
    request(app)
    .get('/users/Testowo')
    .set('x-access-token', token)
    .expect(400)
    .expect('Content-Type', 'application\/json; charset=utf-8')
    .end(function(err, result){
        t.error(err, 'No errors');
        const user = JSON.parse(result.text);
        t.equal(user.success, false, 'Failed');
        t.equal(user.message, 'User not found.', 'User not found');
        t.end();
    })
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
        //t.equal(err.errors.mail.kind, "Duplicate value", "Duplicate email");
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
    .set('x-access-token', token)
    .expect(400)
    .end(function(err, result){
        const errors = JSON.parse(result.text);                        
        t.equal(errors.errors.name.kind, 'Duplicate value', 'Error returned');
        t.end();
    });    
})

test('addUser route error printing', function(t){
    request(app)
    .post('/users')
    .send({ name: 'Test2', mail: 'test2@test.com', password: 'test' })
    .set('x-access-token', token)
    .expect(200)
    .end(function(err, result){
        const newUser = JSON.parse(result.text);                        
        t.equal(newUser.mail, 'test2@test.com', 'User returned');
        t.end();
    });    
})

test('checking if authenticated', function(t){
     request(app)
    .post('/authenticate')
    .send({"name": "Test", "password": "test"})
    .expect(200)
    .end(function(err, result){       
        const res = JSON.parse(result.text);  
        const token = res.token;  
        request(app)
        .get('/tasks')
        .set('x-access-token', token)
        .expect(200)
        .end(function(err, result){
            t.error(err, 'No errors');
            t.equal(result.text, '[]', 'Empty tasks list');
            t.end();
        })
    });
})

test('isLogged wrong token', function(t){
    request(app)
    .get('/tasks')
    .set('x-access-token', 'token')
    .expect(400)
    .end(function(err, result){
        const res = JSON.parse(result.text);
        t.error(err, 'No errors');
        t.equal(res.message, 'Failed to authenticate token.', 'wrong token');
        t.end();
    });
})

test('isLogged without token', function(t){
     request(app)
    .post('/authenticate')
    .send({"name": "Test", "password": "test"})
    .expect(200)
    .end(function(err, result){
        request(app)
        .get('/tasks')
        .expect(400)
        .end(function(err, result){
            const res = JSON.parse(result.text);
            t.error(err, 'No errors');
            t.equal(res.message, 'No token provided.', 'No token send');
            t.end();
        })
    });
})


test.onFinish(function(){    
    mongoose.connect(config.database, function(){
        mongoose.connection.db.dropDatabase();                
        process.exit(0);
    });
});
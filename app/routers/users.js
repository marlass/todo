const express = require('express');
const router = express.Router();

const user = require('./../models/user');

const isLogged = require('./../middleware/authorization');

router.use(isLogged);

router.route('/')
     .get(function(req, res) {
        user.getAll(function(err, users){
            res.json(users);
        });
     })
     .post(function(req, res) {
        user.add(req.body, function(err, result){
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(result);
            }
        }) 
     }) 
     
router.route('/:user_name')
    .get(function(req, res) {
        user.get(req.params.user_name, function(err, user){
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(user);
            }
        })
    })
    .post(function(req, res) {
        user.update(req.params.user_name, req.body, function(err, result){
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(result);
            }
        })
    })   
    .delete(function(req, res) {
        user.remove(req.params.user_name, function(err, user){
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(user);
            }
        })
    })

module.exports = router;
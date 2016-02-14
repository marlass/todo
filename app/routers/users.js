const express = require('express');
const router = express.Router();

const user = require('./../models/user');

router.route('/')
     .get(function(req, res) {
        user.getAll(function(err, users) {
            res.json(users);
        });
     })
     .post(function(req, res) {
        user.add(req.body, function(err, result) {
            if (err)
                res.json(err);
            else
                res.json(result);
        }) 
     }); 

module.exports = router;
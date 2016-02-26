const express = require('express');
const router = express.Router();

const task = require('./../models/task');

const isLogged = require('./../middleware/authorization');

router.use(isLogged);

router.route('/')
    .post(function(req, res) {
        task.add(req.body, function(err, result){
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(result);
            }
        })
    })    
    .get(function(req, res) {
        task.getAll(function(err, result){
           res.json(result); 
        });
    });

router.route('/:task_id')
    // get the task with that id (accessed at GET http://localhost:8080/tasks/:task_id)
    .get(function(req, res) {
        task.get(req.params.task_id, function(err, result){
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(result);
            }
        });
    })
    /*
    .put(function(req, res) {
    })
    
    .delete(function(req, res) {
    });*/

module.exports = router;
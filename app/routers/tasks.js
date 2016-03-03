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
        if (req.query.status == 'notDone') {
            task.getAllNotDone(function(err, result){
                res.json(result); 
            });
        } else if (req.query.status == 'done') {
            task.getAllDone(function(err, result){
                res.json(result);
            })
        } else {
            task.getAll(function(err, result){
            res.json(result); 
            });
        }
    });

router.route('/:task_id')
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
    .post(function(req, res) {
        task.update(req.params.task_id, req.body, function(err, result){
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
        task.remove(req.params.task_id, function(err, result){
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(result);
            }
        })
    });

module.exports = router;
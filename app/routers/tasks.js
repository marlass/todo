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
        if (req.query.status == 'todo') {
            task.getAllTodo(req.decoded.name, function(err, result){
                res.json(result); 
            });
        } else if (req.query.status == 'done') {
            task.getAllDone(req.decoded.name, function(err, result){
                res.json(result);
            })
        } else if (req.query.status == 'cancelled') {
            task.getAllCancelled(req.decoded.name, function(err, result){
                res.json(result);
            })
        } else if (req.query.sort == 'priority') {
            task.getAllTodoByPriority(req.decoded.name, function(err, result){
                res.json(result);
            })
        } else if (req.query.sort == 'size') {
            task.getAllTodoBySize(req.decoded.name, function(err, result){
                res.json(result);
            })  
        } else if (req.query.sort == 'deadline') {
            task.getAllTodoByDeadline(req.decoded.name, function(err, result){
                res.json(result);
            })  
        } else if (req.query.sort == 'project') {
            task.getAllTodoByProject(req.decoded.name, function(err, result){
                res.json(result);
            })  
        } else if (req.query.sort == 'real-size') {
            task.getAllDoneByRealSize(req.decoded.name, function(err, result){
                res.json(result);
            })  
        } else {
            if (req.query.tag) {
                task.getAllTodoByTag(req.decoded.name, req.query.tag, function(err, result){
                    res.json(result);
                })
            } else {
                task.getAll(req.decoded.name, function(err, result){
                    res.json(result); 
                });
            }
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
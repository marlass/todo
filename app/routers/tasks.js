const express = require('express');
const router = express.Router();

const task = require('./../models/task');

const isLogged = require('./../middleware/authorization');

router.use(isLogged);

router.route('/')
    // create a task (accessed at POST http://localhost:8080/tasks)
    /*.post(function(req, res) {
    })*/
    
    .get(function(req, res) {
        task.getAll(function(err, result){
           res.json(result); 
        });
    });

router.route('/:task_id')
    // get the task with that id (accessed at GET http://localhost:8080/tasks/:task_id)
    /*.get(function(req, res) {
    })
    
    .put(function(req, res) {
    })
    
    .delete(function(req, res) {
    });*/

module.exports = router;
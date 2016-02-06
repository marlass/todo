const express = require('express');
const router = express.Router();

const Task = require('./../models/task');

const isLogged = require('./../middleware/authorization');

router.use(isLogged);

router.route('/')

    // create a task (accessed at POST http://localhost:8080/tasks)
    .post(function(req, res) {
        
        const task = new Task();    // create a new instance of the Task model
        task.name = req.body.name;  // set the tasks name (comes from the request)

        // save the task and check for errors
        task.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Task created!' });
        });
        
    })
    
    .get(function(req, res) {
        Task.find(function(err, tasks) {
            if (err)
                res.send(err);

            res.json(tasks);
        });
    });

router.route('/:task_id')
    // get the task with that id (accessed at GET http://localhost:8080/tasks/:task_id)
    .get(function(req, res) {
        Task.findById(req.params.task_id, function(err, task) {
            if (err)
                res.send(err);
            res.json(task);
        });
    })
    
    .put(function(req, res) {

        // use our task model to find the task we want
        Task.findById(req.params.task_id, function(err, task) {

            if (err)
                res.send(err);

            task.name = req.body.name;  // update the tasks info

            // save the task
            task.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Task updated!' });
            });

        });
    })
    
    .delete(function(req, res) {
        Task.remove({
            _id: req.params.task_id
        }, function(err, task) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;
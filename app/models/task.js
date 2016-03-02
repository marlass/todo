const Task = require('./db/task');

module.exports = {
add: function(task, cb){
    const newTask = new Task(task);
    
    newTask.trySave(function(err, task){
        if (err)
            cb(err);
        else
            cb(null, task);
    });
},
update: function(taskId, task, cb){
    Task.findByIdAndUpdate(taskId, task, {new: true, runValidators: true}, function(err, task){
        if (task) {
            cb(null, task);
        } else {
            if (err === null && task === null) {
                cb({success: false, message: 'Task does not exist.'});
            } else {
                cb(err);
            }
        }
    })
},
remove: function(taskId, cb){
    Task.findByIdAndRemove(taskId, function(err, task){
        if (task) {
            cb(null, task);
        } else {
            cb({success: false, message: 'Task not found.'});
        }
    })
},
get: function(taskId, cb){
    Task.findById(taskId, function(err, task){
        if (task) {
            cb(null, task);
        } else {
            cb({success: false, message: 'Task not found.'});
        }
    })
},
getAll: function(cb){
    Task.find({}, function(err, tasks) {
        cb(err, tasks);
  });
},
getAllNotDone: function(cb){
    Task.find({done: null}, function(err, tasks) {
        cb(err, tasks);
    })
}
}
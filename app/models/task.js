const Task = require('./db/task');

module.exports = {
add: function(task, cb){
    const newTask = new Task(task);
    
    newTask.trySave(function(err, task) {
        if (err)
            cb(err);
        else
            cb(null, task);
    });
},
getAll: function(cb){
    Task.find({}, function(err, tasks) {
        cb(err, tasks);
  });
}
}
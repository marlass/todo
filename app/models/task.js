const Task = require('./db/task');

module.exports = {
add: function(task, cb){
    const newTask = new Task();
    newTask.name = task.name;
    
    newTask.save(function(err) {
        if (err)
            cb(err, null);
        else
            cb(null, true);
    });
},
remove: function(task, cb){
    
},
update: function(task, cb){
    
},
getAll: function(cb){
    Task.find({}, function(err, tasks) {
        cb(err, tasks);
  });
},
get: function(task, cb){
    
}
}
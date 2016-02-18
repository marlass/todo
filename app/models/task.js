const Task = require('./db/task');

module.exports = {
/*add: function(task, cb){
    const newTask = new Task();
    newTask.name = task.name;
    
    newTask.save(function(err) {
        if (err)
            cb(err, null);
        else
            cb(null, true);
    });
},*/
getAll: function(cb){
    Task.find({}, function(err, tasks) {
        cb(err, tasks);
  });
}
}
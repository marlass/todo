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
getAll: function(user, cb){
    Task.find({user: user}, function(err, tasks) {
        cb(err, tasks);
  });
},
getAllDone: function(user, cb){
    Task.find({user: user, status: 'done'}, function(err, tasks) {
        cb(err, tasks);
    })  
},
getAllTodo: function(user, cb){
    Task.find({user: user, status: 'todo'}, function(err, tasks) {
        cb(err, tasks);
    })
},
getAllCancelled: function(user, cb){
    Task.find({user: user, status: 'cancelled'}, function(err, tasks) {
        cb(err, tasks);
    })
},
getAllTodoByPriority: function(user, cb){
    Task.find({user: user, status: 'todo'}).sort({ priority: 1 }).exec(function(err, tasks) {
        cb(err, tasks);
    })
},
getAllTodoBySize: function(user, cb){
    Task.find({user: user, status: 'todo'}).sort({size: 1}).exec(function(err, tasks){
        cb(err, tasks);
    })
},
getAllDoneByRealSize: function(user, cb){
    Task.find({user: user, status: 'done'}).sort({real_size: 1}).exec(function(err, tasks){
        cb(err, tasks);
    })
},
getAllTodoByDeadline: function(user, cb){
    Task.find({user: user, status: 'todo'}).sort({deadline: 1}).exec(function(err, tasks){
        cb(err, tasks);
    })
},
getAllTodoByProject: function(user, cb){
    Task.find({user: user, status: 'todo'}).sort({project: 1}).exec(function(err, tasks){
        cb(err, tasks);
    })
},
getAllTodoByTag: function(user, tag, cb){
    Task.find({user: user, tags: tag, status: 'todo'}).exec(function(err, tasks){
        cb(err, tasks);
    })
}
}
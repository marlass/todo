const Project = require('./db/project');

module.exports = {
add: function(project, cb){
    
},
remove: function(project, cb){
    
},
update: function(project, cb){
    
},
getAll: function(cb){
    Project.find({}, function(err, projects) {
        cb(err, projects);
  });
},
get: function(project, cb){
    
}
}
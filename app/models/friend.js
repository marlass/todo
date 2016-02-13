const Friend = require('./db/friend');

module.exports = {
add: function(friend, cb){
    
},
remove: function(friend, cb){
    
},
update: function(friend, cb){
    
},
getAll: function(cb){
    Friend.find({}, function(err, friends) {
        cb(err, friends);
  });
},
get: function(friend, cb){
    
}
}
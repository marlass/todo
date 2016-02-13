const User = require('./db/user');

module.exports = {
add: function(user, cb){
    User.create(user, function(err, user){
        if (err)
            cb(err, null);
        else
            cb(null, true);
    })    
},
remove: function(user, cb){
    
},
update: function(user, cb){
    
},
getAll: function(cb){
    User.find({}, function(err, users) {
        cb(err, users);
  });
},
get: function(user, cb){
    
}
};

const User = require('./db/user');

module.exports = {
add: function(user, cb){
    const newUser = new User(user);
    newUser.trySave(function(err, user){
        if (err)
            cb(err);
        else
            cb(null, user);
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

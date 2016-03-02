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
update: function(userName, user, cb){
    User.findOneAndUpdate({'name': userName}, user, {new: true, runValidators: true}, function(err, user){
        if (user) {
            cb(null, user);
        } else {
            if (err === null && user === null) {
                cb({success: false, message: 'User does not exist.'});
            } else {
                cb(err);
            }
        }
    })
},
remove: function(userName, cb){
    User.findOneAndRemove({'name': userName}, function(err, user){
        if (user) {
            cb(null, user);
        } else {
            cb({success: false, message: 'User does not exist.'});
        }
    })
},
getAll: function(cb){
    User.find({}, function(err, users) {
        cb(err, users);
    });
},
get: function(userName, cb){
    User.findOne({'name': userName}, function(err, user) {
        if (user) {
            cb(null, user);
        } else {
            cb({success: false, message: 'User not found.'});
        }
    })
}
};

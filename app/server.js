const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const mongoose   = require('mongoose');
mongoose.connect(config.database);
app.set('superSecret', config.secret);

const Task = require('./models/task');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();

app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

router.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
}); 

router.route('/tasks')

    // create a task (accessed at POST http://localhost:8080/api/tasks)
    .post(function(req, res) {
        
        const task = new Task();    // create a new instance of the Task model
        task.name = req.body.name;  // set the tasks name (comes from the request)

        // save the task and check for errors
        task.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Task created!' });
        });
        
    })
    
    .get(function(req, res) {
        Task.find(function(err, tasks) {
            if (err)
                res.send(err);

            res.json(tasks);
        });
    });
    
router.route('/tasks/:task_id')
    // get the task with that id (accessed at GET http://localhost:8080/api/tasks/:task_id)
    .get(function(req, res) {
        Task.findById(req.params.task_id, function(err, task) {
            if (err)
                res.send(err);
            res.json(task);
        });
    })
    
    .put(function(req, res) {

        // use our task model to find the task we want
        Task.findById(req.params.task_id, function(err, task) {

            if (err)
                res.send(err);

            task.name = req.body.name;  // update the tasks info

            // save the task
            task.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Task updated!' });
            });

        });
    })
    
    .delete(function(req, res) {
        Task.remove({
            _id: req.params.task_id
        }, function(err, task) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


app.use('/api', router);

app.listen(port);
console.log('API works on port ' + port);
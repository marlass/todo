const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const mongoose   = require('mongoose');
mongoose.connect(config.database);
app.set('superSecret', config.secret);

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const tasksRouter = require('./routers/tasks');
const projectsRouter = require('./routers/projects');
const friendsRouter = require('./routers/friends');
const usersRouter = require('./routers/users');

app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! Welcome in our API');
});

//authentication - get token from your credentials
app.post('/authenticate', function(req, res) {

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

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/projects', projectsRouter);
app.use('/friends', friendsRouter);
    

app.listen(port);
console.log('API works on port ' + port);
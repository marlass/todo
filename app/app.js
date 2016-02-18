const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Config = require('./config');
const config = new Config();
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const helmet = require('helmet');

const mongoose = require('mongoose');

mongoose.connect(config.database);

const User = require('./models/db/user');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const tasksRouter = require('./routers/tasks');
const projectsRouter = require('./routers/projects');
const friendsRouter = require('./routers/friends');
const usersRouter = require('./routers/users');

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(helmet());

app.get('/', function(req, res) {
    res.send('Hello! Welcome in our API');
});

app.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    //if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = jwt.sign(user, config.secret, {
          expiresIn: 1440*60 // expires in 24 hours
        });
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
//app.use('/projects', projectsRouter);
//app.use('/friends', friendsRouter);
    
module.exports = app;
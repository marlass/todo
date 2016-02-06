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

app.use('/users', usersRouter);

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

app.use(function(req, res, next) {

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


app.use('/tasks', tasksRouter);
app.use('/projects', projectsRouter);
app.use('/friends', friendsRouter);
    

app.listen(port);
console.log('API works on port ' + port);
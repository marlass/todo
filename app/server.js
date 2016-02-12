'use strict';

const app = require('./app');
const port = process.env.PORT || 8080;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(port, function () {
  console.log('Server running on port %d', port);
});

module.exports = server;
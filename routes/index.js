//const ObjectID = require('mongodb').ObjectID;

module.exports = function (app) {

  app.get('/', function (req, res, next) {
      res.sendFile('/index.html');
  });

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);
  app.get('/logout', require('./logout').get);
  app.get('/registration', require('./registration').get);
  app.post('/registration', require('./registration').post);
};
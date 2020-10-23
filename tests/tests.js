var request = require('supertest');
var app = require('../app');

app.get('/repos?q=ruby', function(req, res) {
  res.status(200);
});
 
request(app)
  .get('/repos?q=ruby')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });

app.get('/repos/moradtaleeb', function(req, res) {
  res.status(200);
});
 
request(app)
  .get('/repos/moradtaleeb')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });

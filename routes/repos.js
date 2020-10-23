var express = require('express');
var router = express.Router();
var superagent = require('superagent');
require('dotenv').config();

router.get('/', function(req, res, next) {
  const query = req.query.q
  const sort = req.query.sort || ""

  superagent
    .get('https://api.github.com/search/repositories')
    .query({ q: query, sort: sort })
    .set('authorization', 'token ' + process.env['GITHUB_PERSONAL_TOKEN'])
    .set('User-Agent', 'repofindr')
    .accept('json')
    .pipe(res)
});

router.get('/:user', function(req, res, next) {
  const user = req.params.user

  superagent
    .get('https://api.github.com/users/'+user)
    .set('authorization', 'token '+ process.env['GITHUB_PERSONAL_TOKEN'])
    .set('User-Agent', 'repofindr')
    .accept('json')
    .pipe(res)
});

module.exports = router;

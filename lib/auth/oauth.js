var assert = require('assert-plus');
var logger = require('../logger/logger');

exports.authorize = function (req) {

  assert.object(req.authorization, 'authorization');
  assert.object(req.authorization.bearer, 'authorization.bearer');
//  assert.string(bearer.scope, 'authorization.bearer.scope');
  var bearer = req.authorization.bearer;
  assert.string(bearer.clientId, 'authorization.bearer.clientId');

  //TODO DEBUG
//  console.log(bearer);

  var context = {};
  context.user = function () {

    assert.string(bearer.userId, 'authorization.bearer.userId');
    assert.string(bearer.username, 'authorization.bearer.username');
    assert.string(bearer.email, 'authorization.bearer.email');
  };

  context.client = function (clients) {
//      assert.string(clients, 'clients');

    if (bearer.clientId) {
      //TODO refactor
      for (var i in clients) {
        var client = clients[i];
        if (client === bearer.clientId) {
          return context;
        }
      }
    }

    logger.debug('Invalid clientId in authorization: "%s"', client);
    throw new Error('Invalid authorization clientId: ' + client);
  };

  context.scope = function (scopes) {
//      assert.string(scopes, 'scopes');

    if (bearer.scope) {
      //TODO refactor
      for (var i in scopes) {
        var scope = scopes[i];
        for (var j in bearer.scope) {
          var bearerScope = bearer.scope[j];
          if (scope === bearerScope) {
            return context;
          }
        }
      }
    }

    logger.debug('Invalid scope in authorization: "%s"', scope);
    throw new Error('Invalid authorization scope.');
  };

  return context;
};

module.exports = exports;
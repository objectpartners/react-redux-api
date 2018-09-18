var Q = require('q');
var Boom = require('boom');
var db = require('../services/db');
var props = require('../properties');

module.exports = {
  index: sendCurrentUser,
  login: login
};

function sendCurrentUser(request) {
  return request.server.app.apiCache.get(props.session.secret, function(
    err,
    auth
  ) {
    var currentUser = auth ? auth.user : null;
    return sanitize(currentUser);
  });
}

function login(request) {
  var authenticatedUser;

  if (!request.payload.username || !request.payload.password) {
    return Boom.unauthorized('Missing username or password');
  }

  return db
    .findOne('users', { username: request.payload.username })
    .then(function(user) {
      authenticatedUser = user;
      return validate(request.payload.password, user.password);
    })
    .then(function(isValid) {
      if (!isValid) {
        return Q.reject(Boom.unauthorized('Invalid username or password'));
      }

      return request.server.app.apiCache.set(props.session.secret, {
        user: authenticatedUser
      });
    })
    .then(function() {
      return sanitize(authenticatedUser);
    })
    .fail(function(err) {
      return Boom.unauthorized(err.message);
    });
}

function validate(password, userPassword) {
  return Q(password === userPassword);
}

function sanitize(user) {
  if (user) {
    return {
      authenticated: true,
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin
      }
    };
  } else {
    return { user: null };
  }
}

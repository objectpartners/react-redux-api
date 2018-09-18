var db = require('../services/db');

module.exports = {
  index: function(request, reply) {
    var query = request.query;

    if (query.page) {
      return db
        .page('users', query)
        .then(function(users) {
          return users;
        })
        .fail(function(err) {
          return Boom.badImplementation(err);
        });
    } else {
      return db
        .find('users', query)
        .then(function(users) {
          return users;
        })
        .fail(function(err) {
          return Boom.badImplementation(err);
        });
    }
  },

  create: function(request, reply) {
    return db
      .insert('users', request.payload)
      .then(function(user) {
        return user;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  show: function(request, reply) {
    var id = request.params.userId;

    return db
      .findOne('users', { _id: id })
      .then(function(user) {
        return user;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  update: function(request, reply) {
    var id = request.params.userId;

    return db
      .update('users', { _id: id }, request.payload)
      .then(function(user) {
        return user;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  destroy: function(request, reply) {
    var id = request.params.userId;

    return db
      .remove('users', { _id: id })
      .then(function() {
        return;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  }
};

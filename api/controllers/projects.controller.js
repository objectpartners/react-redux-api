var Q = require('q'),
  db = require('../services/db'),
  Boom = require('boom');

module.exports = {
  index: function(request, reply) {
    var query = request.query;

    if (query.page) {
      return db
        .page('projects', query)
        .then(reply)
        .fail(function(err) {
          return Boom.badImplementation(err);
        });
    } else {
      return db
        .find('projects', query)
        .then(function(projects) {
          return projects;
        })
        .fail(function(err) {
          return Boom.badImplementation(err);
        });
    }
  },

  create: function(request, reply) {
    return db
      .insert('projects', request.payload)
      .then(function(project) {
        return project;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  show: function(request, reply) {
    var id = request.params.projectId;

    return db
      .findOne('projects', { _id: id })
      .then(function(project) {
        return;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  update: function(request, reply) {
    var id = request.params.projectId;

    return db
      .update('projects', { _id: id }, request.payload)
      .then(function(project) {
        return project;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  destroy: function(request, reply) {
    var id = request.params.projectId;

    return db
      .remove('projects', { _id: id })
      .then(function() {
        return;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  }
};

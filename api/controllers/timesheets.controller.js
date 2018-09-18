var Q = require('q'),
  db = require('../services/db'),
  _ = require('lodash'),
  Boom = require('boom');

module.exports = {
  index: function(request, reply) {
    var userId = request.params.userId;
    var query = request.query;

    if (userId && userId !== 'all') {
      query = _.extend({ user_id: userId }, query);
    }

    if (query.page) {
      return db
        .page('timesheets', query)
        .then(reply)
        .fail(function(err) {
          return Boom.badImplementation(err);
        });
    } else {
      return db
        .find('timesheets', query)
        .then(reply)
        .fail(function(err) {
          return Boom.badImplementation(err);
        });
    }
  },

  create: function(request, reply) {
    var userId = request.params.userId;

    var newTimesheet = request.payload;
    newTimesheet.user_id = userId;

    return db
      .insert('timesheets', newTimesheet)
      .then(reply)
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  show: function(request, reply) {
    var userId = request.params.userId;
    var id = request.params.timesheetId;

    return db
      .findOne('timesheets', { user_id: userId, _id: id })
      .then(reply)
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  update: function(request, reply) {
    var id = request.params.timesheetId;

    return db
      .update('timesheets', { _id: id }, request.payload)
      .then(reply)
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  },

  destroy: function(request, reply) {
    var id = request.params.timesheetId;

    return db
      .remove('timesheets', { _id: id })
      .then(function() {
        return;
      })
      .fail(function(err) {
        return Boom.badImplementation(err);
      });
  }
};

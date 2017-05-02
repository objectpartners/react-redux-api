'use strict';

var projectsController = require('../controllers/projects.controller');

exports.register = function (server, options, next) {

  var projects = '/projects';
  var projectId = '/projects/{projectId}';

  server.route([
    {
      method: 'GET',
      path: projects,
      handler: projectsController.index,
      config: {auth: false}
    },
    {
      method: 'POST',
      path: projects,
      handler: projectsController.create,
      config: {auth: false}
    },
    {
      method: 'GET',
      path: projectId,
      handler: projectsController.show,
      config: {auth: false}
    },
    {
      method: 'PUT',
      path: projectId,
      handler: projectsController.update,
      config: {auth: false}
    },
    {
      method: 'DELETE',
      path: projectId,
      handler: projectsController.destroy,
      config: {auth: false}
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'projects-routes',
  version: '0.0.1'
};

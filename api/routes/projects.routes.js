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
      config: {auth: false, cors: {origin: ['*'], credentials: true}}
    },
    {
      method: 'POST',
      path: projects,
      handler: projectsController.create,
      config: {auth: false, cors: {origin: ['*'], credentials: true}}
    },
    {
      method: 'GET',
      path: projectId,
      handler: projectsController.show,
      config: {auth: false, cors: {origin: ['*'], credentials: true}}
    },
    {
      method: 'PUT',
      path: projectId,
      handler: projectsController.update,
      config: {auth: false, cors: {origin: ['*'], credentials: true, methods: ['PUT']}}
    },
    {
      method: 'DELETE',
      path: projectId,
      handler: projectsController.destroy,
      config: {auth: false, cors: {origin: ['*'], credentials: true}}
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'projects-routes',
  version: '0.0.1'
};

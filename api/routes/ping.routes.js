exports.register = function(server, options, next) {
  var ping = '/ping';

  var handler = require('../controllers/ping.controller');

  server.route([
    {
      method: 'GET',
      path: ping,
      config: { handler: handler.index, auth: false }
    }
  ]);

  return next();
};

exports.register.attributes = {
  name: 'ping-routes',
  version: '0.0.1'
};

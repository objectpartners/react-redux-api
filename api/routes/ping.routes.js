exports.register = function(server, options) {
  var ping = '/ping';

  var handler = require('../controllers/ping.controller');

  server.route([
    {
      method: 'GET',
      path: ping,
      config: { handler: handler.index, auth: false }
    }
  ]);
};

exports.name = 'ping-routes';
exports.version = '0.0.1';

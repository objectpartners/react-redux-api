var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');
var cookie = require('hapi-auth-cookie');
var props = require('./properties');
var log = require('./logger');

var server = new Hapi.Server();

server.realm.modifiers.route.prefix = props.server.routePrefix;

server.connection({
  port: props.server.port,
  routes: {
    cors: true
  }
});

// establish a session cache
var cache = server.cache({
  segment: 'sessions',
  expiresIn: props.session.expires
});
server.app.cache = cache;

// set up the view rendering
server.views({
  engines: {
    jade: require('jade')
  },
  path: Path.join(__dirname, 'views')
});

server.register(cookie, function(err) {
  server.auth.strategy('session', 'cookie', true, {
    password: props.security.cookieSecret,
    isSecure: false,
    validateFunc: function(request, session, callback) {
      cache.get(session.sid, function(err, cached) {
        if (err || !cached) {
          return callback(err, false);
        }
        return callback(null, true, cached.user);
      });
    }
  });
});

// register the routes
server.register(
  [
    require('./routes/ping.routes'),
    require('./routes/auth.routes'),
    require('./routes/projects.routes'),
    require('./routes/users.routes')
  ],
  function(err) {
    if (err) {
      log.error(err);
    } else {
      log.info({
        message: 'Started HTTP server',
        port: props.server.port
      });
    }
  }
);

// start em up
server.start();

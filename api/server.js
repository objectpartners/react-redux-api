var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');
var cookie = require('hapi-auth-cookie');
var props = require('./properties');
var log = require('./logger');
var Vision = require('vision');

var server = new Hapi.Server({
  port: props.server.port,
  routes: {
    cors: true
  }
});

server.realm.modifiers.route.prefix = props.server.routePrefix;

// establish a session cache
var apiCache = server.cache({
  segment: 'sessions',
  expiresIn: props.session.expires
});
server.app.apiCache = apiCache;

// set up the view rendering
server
  .register(Vision)
  .then(function(err) {
    server.views({
      engines: {
        jade: require('jade')
      },
      path: Path.join(__dirname, 'views')
    });
  })
  .then(function() {
    return server.register(cookie);
  })
  .then(function(err) {
    server.auth.strategy('session', 'cookie', {
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
  })
  .then(function() {
    // register the routes
    return server.register([
      require('./routes/ping.routes'),
      require('./routes/auth.routes'),
      require('./routes/projects.routes'),
      require('./routes/users.routes')
    ]);
  })
  .then(function(err) {
    if (err) {
      log.error(err);
    } else {
      log.info({
        message: 'Started HTTP server',
        port: props.server.port
      });
    }
  })
  .then(function() {
    // start em up
    server.start();
  });

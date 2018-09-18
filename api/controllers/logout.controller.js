'use strict';
var props = require('../properties');

module.exports = {
  logout: function(request) {
    request.cookieAuth.clear();
    request.server.app.apiCache.drop(props.session.secret);
    return null;
  }
};

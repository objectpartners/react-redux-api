var _ = require('lodash'),
  db = require('../api/services/db'),
  Q = require('q'),
  path = require('path'),
  log = require('../api/logger');

init();

function init() {
  db
    .findOne('users', { username: 'admin' })
    .then(function(user) {
      if (user === null) {
        seed(function() {
          log.info('Finished seeding database');
        });
      } else {
        log.debug('Found user. DB already seeded.');
      }
    })
    .fail(function(err) {
      log.error('Error : ' + err);
    });
}

////////////  USERS //////////////////
function seed(callback) {
  log.debug('Seeding Users into DB');
  var base = path.join(__dirname, '../api/data');
  var users = require(path.join(base, 'users')).users;
  var adminTimesheets = require(path.join(base, 'admin.timesheets')).timesheets;
  var userTimesheets = require(path.join(base, 'user.timesheets')).timesheets;
  var projects = require(path.join(base, 'projects')).projects;

  Q.all(projects.map(project => db.insert('projects', project)))
    .then(function() {
      var userPromises = [];

      _.forEach(users, function(user) {
        log.debug('Seeding ' + user.username);

        db.insert('users', user).then(function(newUser) {
          log.debug('Created ' + newUser.username);

          var timesheets =
            user.username === 'admin' ? adminTimesheets : userTimesheets;

          _.forEach(timesheets, function(timesheet) {
            var timesheetModel = _.omit(timesheet, 'timeunits');
            timesheetModel.user_id = newUser._id;

            db
              .insert('timesheets', timesheetModel)
              .then(function(newTimesheet) {
                log.debug('Seeding timeunits : ' + timesheet.timeunits.length);

                _.forEach(timesheet.timeunits, function(timeunit) {
                  timeunit.timesheet_id = newTimesheet._id;

                  log.debug(
                    'Attempting to seed timeunit : ' + timeunit.project
                  );
                  db
                    .findOne('projects', { name: timeunit.project })
                    .then(function(project) {
                      timeunit.project_id = project._id;
                      return db.insert('timeunits', timeunit);
                    })
                    .then(function(newTimeunit) {
                      log.debug(
                        'Created timeunit for ' + newTimeunit.dateWorked
                      );
                    })
                    .fail(function(err) {
                      log.error('Error : ' + err);
                    });
                });
              });
          });
        });
      });
    })
    .then(function() {
      log.debug('Created user ' + user.username + ' and timesheets.');
    })
    .then(callback)
    .fail(function(err) {
      log.error('Error creating ' + user.username + ' : ' + err);
    });
}

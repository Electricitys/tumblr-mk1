// Initializes the `activity` service on path `/activity`
const { Activity } = require('./activity.class');
const createModel = require('../../models/activity.model');
const hooks = require('./activity.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/activity', new Activity(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('activity');

  service.hooks(hooks);
};

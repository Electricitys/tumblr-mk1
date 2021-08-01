// Initializes the `patient` service on path `/patient`
const { Patient } = require('./patient.class');
const createModel = require('../../models/patient.model');
const hooks = require('./patient.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/patient', new Patient(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('patient');

  service.hooks(hooks);
};

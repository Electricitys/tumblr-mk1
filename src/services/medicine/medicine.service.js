// Initializes the `medicine` service on path `/medicine`
const { Medicine } = require('./medicine.class');
const createModel = require('../../models/medicine.model');
const hooks = require('./medicine.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/medicine', new Medicine(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('medicine');

  service.hooks(hooks);
};

const { BadRequest } = require('@feathersjs/errors');
const { Service } = require('feathers-sequelize');

exports.Activity = class Activity extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }
  async create(data, params) {
    if (!params.user['patient.id']) throw new BadRequest('User not available.');
    if (!params.user['patient.device.id']) throw new BadRequest('Device not available.');
    return super.create({
      deviceId: params['user']['patient.device.id'],
      patientId: params['user']['patient.id'],
      ...data
    }, params);
  }
  async find(params) {
    if (params.query['$include']) {
      params['sequelize'] = {
        include: params.query['$include'].map(({ model, as }) => {
          return {
            model: this.app.service(model).Model,
            as: as
          };
        })
      };
      delete params.query['$include'];
    }
    return super.find(params);
  }
};

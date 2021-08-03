const { Service } = require('feathers-sequelize');

exports.Patient = class Patient extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }

  async remove(id, params) {
    const patient = await this.get(id);
    const ret = await super.remove(id, params);
    if (patient['device.id']) {
      await this.app.service('devices').remove(patient['device.id']);
    }
    return ret;
  }

  async create(data, params) {
    let ret = await super.create(data, params);

    const device = await this.app.service('devices').create({
      patientId: ret['id']
    });

    console.log('device created', device);
    return ret;
  }
  async get(id, params) {
    let ret = await super.get(id, {
      ...params,
      sequelize: {
        include: [{
          model: this.app.service('devices').Model,
          as: 'device'
        }]
      }
    });

    return ret;
  }
};

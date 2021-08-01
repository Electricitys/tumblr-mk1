const { Service } = require('feathers-sequelize');

exports.Users = class Users extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }
  async create(data, params) {
    const ret = await super.create(data, params);
    if (data.role === 'patient') {
      await this.app.service('patient').create({
        name: `patient-${ret.id}${Date.now()}`,
        userId: ret['id']
      });
    }
    if (data.role === 'doctor') {
      await this.app.service('doctor').create({
        name: `doctor-${ret.id}${Date.now()}`,
        userId: ret['id']
      });
    }
    return ret;
  }
};

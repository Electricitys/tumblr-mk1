const { Service } = require('feathers-sequelize');

exports.Users = class Users extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }
  async remove(id, params) {
    const user = await this.get(id);
    const ret = super.remove(id, params);
    if (user["role"] === "patient") {
      await this.app.service("patient").remove(user["patient.id"]);
    }
    if (user["role"] === "doctor") {
      await this.app.service("doctor").remove(user["doctor.id"]);
    }
    return ret;
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

  async get(id, params) {
    let ret = await super.get(id, {
      ...params,
      sequelize: {
        include: [{
          model: this.app.service("doctor").Model,
          as: "doctor"
        }, {
          model: this.app.service("patient").Model,
          as: "patient"
        }]
      }
    });

    return ret;
  }
};

const { Service } = require('feathers-sequelize');

exports.Devices = class Devices extends Service {
  async create(data, params) {
    const defaultValue = {
      label: `device-${data['id']}${Date.now()}`,
      config: {
        medicine: {
          lvl1: {
            name: '',
            time: ''
          },
          lvl2: {
            name: '',
            time: ''
          },
          lvl3: {
            name: '',
            time: ''
          }
        }
      },
      connectionStatus: false,
      ...data
    };
    return super.create(defaultValue, params);
  }
};

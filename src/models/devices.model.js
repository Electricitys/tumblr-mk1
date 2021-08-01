// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const { UUIDV4 } = require('sequelize');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const devices = sequelizeClient.define('devices', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: UUIDV4
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Device'
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    connectionStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  devices.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    const { patient } = models;

    devices.belongsTo(patient);
  };

  return devices;
};

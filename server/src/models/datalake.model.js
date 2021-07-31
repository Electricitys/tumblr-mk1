// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const { UUIDV4 } = require('sequelize');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const datalake = sequelizeClient.define('datalake', {
    _id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: UUIDV4
    },
    activityMessage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activityType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  datalake.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    const { users, devices } = models;

    datalake.belongsTo(users);
    datalake.belongsTo(devices);
  };

  return datalake;
};

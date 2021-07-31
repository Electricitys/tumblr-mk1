const users = require('./users/users.service.js');
const devices = require('./devices/devices.service.js');
const datalake = require('./datalake/datalake.service.js');
const notifications = require('./notifications/notifications.service.js');
const subscription = require('./subscription/subscription.service.js');
const push = require('./push/push.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(devices);
  app.configure(datalake);
  app.configure(notifications);
  app.configure(subscription);
  app.configure(push);
};

const users = require('./users/users.service.js');
const devices = require('./devices/devices.service.js');
const notifications = require('./notifications/notifications.service.js');
const subscription = require('./subscription/subscription.service.js');
const push = require('./push/push.service.js');
const patient = require('./patient/patient.service.js');
const doctor = require('./doctor/doctor.service.js');
const medicine = require('./medicine/medicine.service.js');
const activity = require('./activity/activity.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(devices);
  app.configure(notifications);
  app.configure(subscription);
  app.configure(push);
  app.configure(patient);
  app.configure(doctor);
  app.configure(medicine);
  app.configure(activity);
};

// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const webpush = require('web-push');

const triggerPushMsg = (subscription, dataToSend) => {
  return webpush.sendNotification(subscription, dataToSend)
    .then(response => {
      console.log('msg sent', response);
    }).catch(err => {
      console.error('Subscription is no longer valid: ', err);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    console.log(context.data.notification);
    context.app.service('notifications').get(context.data.notification).then(result => {
      console.log('result', result);
      return result;
    }).then(notification => {
      const dataToSend = {
        'notification': {
          'title': notification.title,
          'body': notification.body,
          'image': notification.image ? notification.image : context.app.settings.image,
          'icon': context.app.settings.logo,
          'data': notification.url ? { 'url': notification.url } : ''
        }
      };
      const vapidKeys = {
        subject: context.app.get('vapid').subject,
        publicKey: context.app.get('vapid').publicKey,
        privateKey: context.app.get('vapid').privateKey,
      };

      console.log('vapidkeys', vapidKeys);

      webpush.setVapidDetails(
        vapidKeys.subject,
        vapidKeys.publicKey,
        vapidKeys.privateKey,
      );

      console.log('datatosend', dataToSend);

      context.app.service('subscription').find().then(result => {
        let promiseChain = Promise.resolve();
        for (let i = 0; i < result.data.length; i++) {
          const subscription = result.data[i];
          promiseChain = promiseChain.then(() => {
            return triggerPushMsg(subscription, JSON.stringify(dataToSend));
          });
        }
        return promiseChain;
      });
    });
    return context;
  };
};

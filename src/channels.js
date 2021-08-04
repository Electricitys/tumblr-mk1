const e = require("cors");

module.exports = function (app) {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    // console.log("connection");
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult, { connection }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      const user = connection["user"];

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      // Channels can be named anything and joined on any condition 

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(connection));

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(connection);
      // app.channel(`userIds/${user.id}`).join(connection);

      if (authResult["authentication"]["strategy"] === "device") {
        const device = connection["device"];
        app.channel("authenticated").leave(connection);
        app.channel(`device/${device["id"]}`).join(connection);
        console.log("device join to", device["id"]);
        app.service("devices").patch(device["id"], {
          connectionStatus: true
        })
      }
      if (user["patient.id"] !== null) {
        app.channel(`patient/${user["patient.id"]}`).join(connection);
      }
      if (user["doctor.id"] !== null) {
        app.channel(`doctor/${user["doctor.id"]}`).join(connection);
      }
    }
  });

  app.on("disconnect", (connection) => {
    if (connection) {
      if (connection["device"]) {
        const device = connection["device"];
        app.service("devices").patch(device["id"], {
          connectionStatus: false
        });
        console.log("device disconnect", device["id"]);
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  app.publish((data, hook) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    console.log('Publishing all events to all authenticated users. See `channels.js` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line

    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated');
  });

  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));

  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });

  app.service("devices").publish("patched", (device) => {
    return [
      app.channel(`devices/${device["id"]}`),
      app.channel(`patient/${device["patientId"]}`)
    ]
  })
};

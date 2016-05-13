define([
  "store"
], function(Store) {
  "use strict";

  var AlarmStore = Store.createStore({
    actions: [
      "cancelAlarm",
      "scheduleAlarm"
    ],

    initialize: function() {
      if (!window.cordova || !cordova.plugins || !cordova.plugins.notification) {
        return;
        //throw new Error("Notification Store: plugin not installed");
      }

      this._plugin = cordova.plugins.notification;
      this._plugin.local.on("schedule", function(notification) {
        console.info("scheduled: " + notification.id, notification);
      });

      // testing
      //this.scheduleDelayed();

      this._getNotifications();
    },

    _getNotifications: function() {
      this._plugin.local.getScheduled(function(notifications) {
        console.info(notifications);
        this.setStoreState({
          notifications: notifications
        })
      }, this);
    },

    scheduleAlarm: function(actionData) {
      var alarm = {
        id: new Date().getUTCMilliseconds(),
        title: actionData.title,
        text: actionData.text,
        at: actionData.at,
        every: actionData.every
      };
      console.info(alarm);
      this._plugin.local.schedule(alarm);
    },

    cancelAlarm: function(actionData) {
      this._plugin.local.cancel(actionData.id, function () {
        // Notifications were cancelled
      });
    },

    scheduleDelayed: function () {
      var now = new Date().getTime(),
        _5_sec_from_now = new Date(now + 5 * 1000);
      this._plugin.local.schedule({
        id: 1,
        title: "Próxima revisión médica",
        text: "Recuerda que debes acudir al médico para tu revisión",
        at: _5_sec_from_now
      });
    }
  });

  return AlarmStore;
});

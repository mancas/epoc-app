define([
  "store",
  "utils/utilities"
], function(Store, utils) {
  "use strict";

  const ALARM_TYPES = utils.ALARM_TYPES;

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
      this._schedulerListener = this.addAlarmToStore.bind(this);
      this._plugin.local.on("schedule", this._schedulerListener);

      // testing
      // this.scheduleDelayed();

      this._getAlarms();
    },

    addAlarmToStore: function(alarm) {
      console.info("scheduled: " + alarm.id, alarm);
      var alarms = this._storeState.alarms;
      alarms.push(alarm);
      this.setStoreState({
        alarms: alarms
      });
    },

    _getAlarms: function() {
      this._plugin.local.getScheduled(function(alarms) {
        console.info(alarms);
        this.setStoreState({
          alarms: alarms
        });
      }, this);
    },

    scheduleAlarm: function(actionData) {
      var alarm = {
        id: new Date().getUTCMilliseconds(),
        title: actionData.title,
        text: actionData.text,
        at: actionData.at,
        every: actionData.every,
        data: {
          type: actionData.type || ALARM_TYPES.SYSTEM
        }
      };

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
        at: _5_sec_from_now,
        every: 1
      });
    }
  });

  return AlarmStore;
});

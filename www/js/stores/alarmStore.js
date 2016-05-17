define([
  "store",
  "utils/utilities",
  "utils/actions"
], function(Store, utils, Actions) {
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
      this._plugin.local.on("trigger", function(alarm) {
        console.info(alarm);
        alert("trigger: " + alarm.id);
      });
      this._plugin.local.on("click", function(alarm) {
        alert("clicked: " + alarm.id);
      });

      // testing
      // this.scheduleDelayed();
      // this.cancel(1);

      this._plugin.local.getTriggered(function(alarms) {
        console.info("already triggered", alarms);
      }, this);

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
      this.dispatcher.dispatch(new Actions.ShowSnackbar({
        label: "Alarma creada"
      }));
    },

    cancelAlarm: function(actionData) {
      this._plugin.local.cancel(actionData.id, function () {
        // Alarm cancelled so let's update the store
        this._getAlarms();
        this.dispatcher.dispatch(new Actions.ShowSnackbar({
          label: "Alarma cancelada"
        }));
      }.bind(this));
    },

    scheduleDelayed: function () {
      var now = new Date().getTime(),
        _5_sec_from_now = new Date(now + 5 * 1000);
      this._plugin.local.schedule({
        id: 1,
        title: "Próxima revisión médica",
        text: "Recuerda que debes acudir al médico para tu revisión",
        at: _5_sec_from_now,
        every: 30
      });
    },

    cancel: function(id) {
      this._plugin.local.cancel(id, function () {
        // Notifications were cancelled
        console.info("cancelled");
      });
    }
  });

  return AlarmStore;
});

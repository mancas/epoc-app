define([
  "store",
  "utils/databaseManager"
], function(Store, dbManager) {
  "use strict";

  var BloodSaturationStore = Store.createStore({
    actions: [
      "addBloodSaturation"
    ],

    getInitialStoreState: function() {
      return {
        data: []
      };
    },

    initialize: function() {
      var self = this;
      dbManager.openDatabase(function() {
        self.getBloodSaturationData();
      }, function(error) {
        console.error("Blood Saturation db error", error);
      });
    },

    // Be sure this function is always called inside an openDatabase callback
    getBloodSaturationData: function() {
      var self = this;

      dbManager.select("bloodSaturation", null, null, function(result) {
        var data = [];
        for (var i = 0; i < result.rows.length; i++) {
          data.push(result.rows.item(i));
        }

        self.setStoreState({
          data: data
        });
      }, function(error) {
        console.error("Blood Saturation select error", error);
      });
    },

    addBloodSaturation: function(actionData) {
      var bloodSaturationMeasure = {
        type: actionData.type,
        title: actionData.title,
        content: actionData.text,
        read: actionData.read || 0
      };
      var self = this;

      dbManager.openDatabase(function() {
        dbManager.insert("notification", notification, function(result) {
          // Update store state
          var currentNotifications = self._storeState.notifications;
          notification.id = result.insertId;
          currentNotifications.push(notification);
          self.setStoreState({
            notifications: currentNotifications
          });
        }, function(error) {
          console.error("Notifications insert error", error);
        });
      }, function(error) {
        console.error("Notifications db error", error);
      });
    },

    updateNotification: function(actionData) {
      var self = this;
      var whereBuilder = dbManager.createWhereBuilder();
      var whereClause = {};
      if (actionData.hasOwnProperty("id")) {
        whereClause  = {id: actionData.id}
      } else {
        whereClause  = {type: actionData.type}
      }
      whereBuilder.and(whereClause);

      dbManager.update("notification", {read: actionData.read}, whereBuilder.where, function() {
        // Time to update notifications
        self.getNotifications();
      }, function(error) {
        console.error("Notifications update error", error);
      });
    }
  });

  return BloodSaturationStore;
});

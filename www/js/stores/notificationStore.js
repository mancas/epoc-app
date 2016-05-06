define([
  "store",
  "utils/databaseManager"
], function(Store, dbManager) {
  "use strict";

  var NotificationStore = Store.createStore({
    actions: [
      "addNotification"
    ],

    getInitialStoreState: function() {
      return {
        notifications: []
      };
    },

    initialize: function() {
      var self = this;
      dbManager.openDatabase(function() {
        self.getNotifications();
      }, function(error) {
        console.error("Notifications db error", error);
      });
    },

    // Be sure this function is always called inside an openDatabase callback
    getNotifications: function() {
      var self = this;
      var whereBuilder = dbManager.createWhereBuilder();
      whereBuilder.and({read: 0});

      dbManager.select("notification", null, whereBuilder.where, function(result) {
        var notifications = [];
        for (var i = 0; i < result.rows.length; i++) {
          notifications.push(result.rows.item(i));
        }

        self.setStoreState({
          notifications: notifications
        });
      }, function(error) {
        console.error("Notifications select error", error);
      });
    },

    addNotification: function(actionData) {
      var notification = {
        title: actionData.title,
        content: actionData.text,
        read: 0
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
    }
  });

  return NotificationStore;
});

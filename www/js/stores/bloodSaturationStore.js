define([
  "store",
  "utils/databaseManager",
  "utils/actions"
], function(Store, dbManager, Actions) {
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
      var mark = {
        date: actionData.date.toString(),
        value: actionData.value
      };
      var self = this;

      dbManager.openDatabase(function() {
        dbManager.insert("bloodSaturation", mark, function(result) {
          // Update store state
          var currentData = self._storeState.data;
          mark.id = result.insertId;
          currentData.push(mark);
          self.setStoreState({
            data: currentData
          });
          self.dispatcher.dispatch(new Actions.ShowSnackbar({
            label: "Saturación en sangre añadida"
          }));
        }, function(error) {
          console.error("Blood Saturation insert error", error);
        });
      }, function(error) {
        console.error("Blood Saturation db error", error);
      });
    }
  });

  return BloodSaturationStore;
});

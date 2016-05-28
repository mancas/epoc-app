define([
  "store",
  "utils/databaseManager",
  "utils/actions"
], function(Store, dbManager, Actions) {
  "use strict";

  var ExercisesDiaryStore = Store.createStore({
    actions: [
      "addExerciseRecord"
    ],

    getInitialStoreState: function() {
      return {
        records: []
      };
    },

    initialize: function() {
      var self = this;
      dbManager.openDatabase(function() {
        self.getExercisesRecordsData();
      }, function(error) {
        console.error("Exercises Diary db error", error);
      });
    },

    // Be sure this function is always called inside an openDatabase callback
    getExercisesRecordsData: function() {
      var self = this;

      dbManager.select("exercisesDiary", null, null, function(result) {
        var data = [];
        for (var i = 0; i < result.rows.length; i++) {
          data.push(result.rows.item(i));
        }

        self.setStoreState({
          records: data
        });
      }, function(error) {
        console.error("Exercises Diary select error", error);
      });
    },

    addExerciseRecord: function(actionData) {
      var record = {
        date: actionData.date.toString(),
        time: actionData.time,
        borgValue: actionData.borgValue
      };
      var self = this;

      dbManager.openDatabase(function() {
        dbManager.insert("exercisesDiary", record, function(result) {
          // Update store state
          var currentData = self._storeState.records;
          record.id = result.insertId;
          currentData.push(record);
          self.setStoreState({
            records: currentData
          });
          self.dispatcher.dispatch(new Actions.ShowSnackbar({
            label: "Nueva caminata añadida"
          }));
        }, function(error) {
          console.error("Exercises Diary insert error", error);
        });
      }, function(error) {
        console.error("Exercises Diary db error", error);
      });
    }
  });

  return ExercisesDiaryStore;
});

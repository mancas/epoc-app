define([
  "store",
  "utils/databaseManager",
  "utils/utilities",
], function(Store, dbManager, utils) {
  "use strict";

  const USER_MODEL_KEYS = [
    "userName",
    "gradeEPOC",
    "lastRevision",
    "isSmoker",
    "weight",
    "height",
    "birth"
  ];

  var UserStore = Store.createStore({
    getInitialStoreState: function() {
      return {
        test: true
      };
    },

    actions: [
      "updateUserData"
    ],

    updateUserData: function(actionData) {
      var oldState = this.getStoreState();
      var newState = {};
      USER_MODEL_KEYS.forEach(function(key) {
        if (actionData.hasOwnProperty(key) && oldState[key] !== actionData[key]) {
          newState[key] = actionData[key];
        } else {
          newState[key] = oldState[key];
        }
      });

      this.setStoreState(newState);
      if (actionData.persist) {
        this._updateDB();
      }
    },

    _updateDB: function() {
      var model = utils.prepareModel(this._storeState);
      dbManager.openDatabase(function(){
        dbManager.insert("User", model, function(result) {
          console.info("INSERT RESULT", result);
          dbManager.select("User", null, null, function(result) {
            console.info("SELECT result", result.rows.item(0));
          });
        });
      }, function(err) {
        console.error(err);
      });
    }
  });

  return UserStore;
});

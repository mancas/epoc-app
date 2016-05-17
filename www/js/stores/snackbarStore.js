define([
  "store",
  "utils/utilities"
], function(Store, utils) {
  "use strict";

  var SnackbarStore = Store.createStore({
    actions: [
      "showSnackbar"
    ],

    getInitialStoreState: function() {
      return {
        label: ""
      };
    },

    showSnackbar: function(actionData) {
      this.setStoreState({
        label: actionData.label
      });
    }
  });

  return SnackbarStore;
});

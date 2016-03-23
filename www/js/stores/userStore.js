define(["store"], function(Store) {
  "use strict";

  var UserStore = Store.createStore({
    getInitialState: function() {
      return {
        test: true
      };
    }
  });

  return UserStore;
});

define(["_"], function (_) {
  "use strict";

  var _stores = {};

  function StoreMixin(storeName) {
    return {
      getStore: function () {
        if (!_stores[storeName]) {
          throw new Error("Unavailable store " + storeName);
        }
        return _stores[storeName];
      },

      _updateStoreState: function () {
        this.setState(this.getStore().getStoreState());
      },

      componentWillMount: function () {
        this.getStore().on("change", this._updateStoreState);
      },

      componentWillUnmount: function () {
        this.getStore().off("change", this._updateStoreState);
      }
    }
  }

  StoreMixin.register = function (stores) {
    _.extend(_stores, stores);
  };

  StoreMixin.cleanup = function () {
    _stores = {};
  };

  return StoreMixin;
});

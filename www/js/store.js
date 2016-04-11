define([], function() {
  "use strict";

  var storePrototype = {
    _storeListeners: {},

    _registerActions: function(actions) {
      // check that store methods are implemented
      Array.prototype.forEach.call(actions, function(handler) {
        if (typeof this[handler] !== "function") {
          throw new Error("Store needs to implement an action handler for " +
            handler);
        }
      }.bind(this));

      this.dispatcher.register(this, actions);
    },

    getStoreState: function(key) {
      return key ? this._storeState[key] : this._storeState;
    },

    setStoreState: function(newState) {
      for (var key in newState) {
        this._storeState[key] = newState[key];
        this.trigger("change:" + key);
      }
      this.trigger("change");
    },

    resetStoreState: function() {
      if (typeof this.getInitialStoreState === "function") {
        this._storeState = this.getInitialStoreState();
      } else {
        this._storeState = {};
      }
    },

    on: function(event, callback) {
      if (this._storeListeners.hasOwnProperty(event)) {
        this._storeListeners[event].push(callback);
      } else {
        this._storeListeners[event] = [callback];
      }
    },

    off: function(event, callback) {
      if (!this._storeListeners.hasOwnProperty(event)) {
        return;
      }
      var idx = this._storeListeners[event].indexOf(callback);
      if (idx === -1) {
        return;
      }
      this._storeListeners[event].splice(idx, 1);
      if (!this._storeListeners[event].length) {
        delete this._storeListeners[event];
      }
    },

    trigger: function(event) {
      if (!this._storeListeners.hasOwnProperty(event)) {
        return;
      }

      Array.prototype.forEach.call(this._storeListeners[event], function(listener) {
        listener();
      });
    }
  };

  function createStore(storeProto) {
    var BaseStore = function(dispatcher, options) {
      options = options || {};

      if (!dispatcher) {
        throw new Error("Missing required dispatcher");
      }
      this.dispatcher = dispatcher;
      if (Array.isArray(this.actions)) {
        this._registerActions(this.actions);
      }

      if (typeof this.initialize === "function") {
        this.initialize(options);
      }

      if (typeof this.getInitialStoreState === "function") {
        this._storeState = this.getInitialStoreState();
      } else {
        this._storeState = {};
      }
    };
    BaseStore.prototype = _.extend({}, // destination object
      storePrototype,
      storeProto);

    return BaseStore;
  }

  return {
    createStore: createStore
  };
});

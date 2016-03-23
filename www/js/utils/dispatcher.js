define([], function() {
  "use strict";

  function Dispatcher() {
    this._events = {};
    this._queue = [];
  }

  Dispatcher.prototype = {
    register: function(store, events) {
      Array.prototype.forEach.call(events, function(eventType) {
        if (this._events.hasOwnProperty(eventType)) {
          this._events[eventType].push(store);
        } else {
          this._events[eventType] = [store];
        }
      }.bind(this));
    },

    dispatch: function(action) {
      this._queue.push(action);
      this._dispatchNextAction();
    },

    _dispatchNextAction: function() {
      if (!this._queue.length || this._working) {
        return;
      }

      var action = this._queue.shift();
      var type = action.name;

      var registeredStores = this._events[type];
      if (!registeredStores) {
        console.error("No stores registered for " + type);
        return;
      }

      Array.prototype.forEach.call(registeredStores, function(store) {
        try {
          store[type](action);
        } catch (x) {
          console.error("[Dispatching action caused an exception: ", x);
        }
      }.bind(this));

      this._working = false;
      this._dispatchNextAction();
    }
  };

  return Dispatcher;
});

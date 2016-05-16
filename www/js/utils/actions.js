define([], function() {
  "use strict";

  function arrayDiff(arr1, arr2) {
    return arr1.filter(function(item) {
      return arr2.indexOf(item) === -1;
    });
  }

  /**
   * Retrieves the type name of an object or constructor. Fallback to "unknown"
   * when it fails.
   *
   * @param  {Object} obj
   * @return {String}
   */
  function typeName(obj) {
    if (obj === null) {
      return "null";
    }

    if (typeof obj === "function") {
      return obj.name || obj.toString().match(/^function\s?([^\s(]*)/)[1];
    }

    if (typeof obj.constructor === "function") {
      return typeName(obj.constructor);
    }

    return "unknown";
  }

  function checkSchema(schema, values) {
    var definedProperties = Object.keys(values).filter(function(name) {
      return typeof values[name] !== "undefined";
    });
    var diff = arrayDiff(Object.keys(schema), definedProperties);
    if (diff.length > 0) {
      throw new TypeError("missing required " + diff.join(", "));
    }
  }

  function checkSchemaTypes(schema, values) {
    Object.keys(schema, function(name) {
      // Allow multiple types
      var types = schema[name];
      types = Array.isArray(types) ? types : [types];

      if (!_matchTypes(values[name], types)) {
        throw new TypeError("Invalid type");
      }
    });
  }

  function _matchTypes(value, types) {
    return types.some(function(Type) {
      try {
        return typeof Type === "undefined" || // skip checking
          Type === null && value === null || // null type
          value.constructor === Type || // native type
          Type.prototype.isPrototypeOf(value) || // custom type
          typeName(value) === typeName(Type);    // type string eq.
      } catch (e) {
        return false;
      }
    });
  }

  function Action(name, schema, values) {
    checkSchema(schema || {}, values || {});
    checkSchemaTypes(schema || {}, values || {});

    // If we are here, everything went well
    for (var prop in values) {
      this[prop] = values[prop];
    }

    this.name = name;
  }

  Action.define = function(name, schema) {
    return Action.bind(null, name, schema);
  };

  return {
    Action: Action,

    CreateUser: Action.define("createUser", {
      // userName: String, Optional,
      // gradeEPOC: String, Optional,
      // lastRevision: String, Optional,
      // isSmoker: Int Optional,
      // weight: Int Optional,
      // height: Int Optional,
      // birth: String, Optional
    }),

    SetupApp: Action.define("setupApp", {
      // userName: String, Optional,
      // gradeEPOC: String, Optional,
      // lastRevision: String, Optional,
      // isSmoker: Int Optional,
      // weight: Int Optional,
      // height: Int Optional,
      // birth: String, Optional
    }),

    AppReady: Action.define("appReady", {}),

    UpdateUserData: Action.define("updateUserData", {
      // userName: String, Optional,
      // gradeEPOC: String, Optional,
      // lastRevision: String, Optional,
      // isSmoker: Int Optional,
      // weight: Int Optional,
      // height: Int Optional,
      // birth: String, Optional
      // persist: Boolean, Optional
    }),

    ScheduleAlarm: Action.define("scheduleAlarm", {
      title: String,
      text: String,
      at: Object,
      every: [Number, String]
    }),

    CancelAlarm: Action.define("cancelAlarm", {
      id: Number
    }),

    AddNotification: Action.define("addNotification", {
      title: String,
      text: String,
      type: String
      // read: Boolean, Optional
    }),

    UpdateNotification: Action.define("updateNotification", {
      // id: Number, Optional
      // type: String, Optional
      read: Boolean
    }),

    AddBloodSaturation: Action.define("addBloodSaturation", {
      date: Object,
      value: Number
    })
  };
});

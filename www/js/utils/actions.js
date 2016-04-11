define([], function() {
  "use strict";

  function arrayDiff(arr1, arr2) {
    return arr1.filter(function(item) {
      return arr2.indexOf(item) === -1;
    });
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
    checkSchema(schema, values);
    checkSchemaTypes(schema, values);

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
    Action: Action
  };
});

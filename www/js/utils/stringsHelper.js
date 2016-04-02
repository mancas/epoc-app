define(["strings/es"], function(appStrings) {
  "use strict";

  var StringsHelper = {
    getString: function(id, params) {
      var string = appStrings[id];
      if (!string) {
        throw new Error("Undefined string for string ID: " + id);
      }

      if (typeof params !== "undefined") {
        for (var i = 0; i < params.length; i++) {
          var param = params[i];
          for (var key in param) {
            var paramValue = param[key];
            if (typeof paramValue === "object") {
              paramValue = this.getString(paramValue.id, paramValue.params);
            }
            string = string.replace("{{" + key.toUpperCase() + "}}", paramValue);
          }
        }
      }

      return string;
    }
  };

  return StringsHelper;
});

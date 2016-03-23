require.config({
  baseUrl: "js/",
  paths: {
    "react": "../vendor/react.min",
    "reactRouter": "../vendor/ReactRouter.min",
    "classnames": "../vendor/classNames",
    "_": "../vendor/underscore.min"
  },

  shim: {
    "react": {
      exports: "React"
    },
    "reactRouter": {
      deps: ["react"],
      exports: "ReactRouter"
    },
    "classnames": {
      deps: [],
      exports: "classnames"
    },
    "_": {
      deps: [],
      exports: "_"
    },
    "appShim": {
      deps: ["react", "reactRouter", "classnames", "_"],
      exports: "AppShim"
    }
  }
});


require([
  "appShim"
], function() {
  "use strict";
  require(["build/bootstrap"], function(App) {
    App.init();
  });
});

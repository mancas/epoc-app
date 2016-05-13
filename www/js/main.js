require.config({
  baseUrl: "js/",
  paths: {
    "react": "../vendor/react",
    "reactRouter": "../vendor/ReactRouter.min",
    "classnames": "../vendor/classNames",
    "_": "../vendor/underscore.min",
    "jquery": "../vendor/jquery.min",
    "Backbone": "../vendor/backbone.min",
    "Chart": "../vendor/Chart.min"
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
    "jquery": {
      deps: [],
      exports: "$"
    },
    "Backbone": {
      deps: ["jquery"],
      exports: "Backbone"
    },
    "Chart": {
      deps: [],
      exports: "Chart"
    },
    "appShim": {
      deps: ["react", "jquery", "Backbone", "classnames", "_"],
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

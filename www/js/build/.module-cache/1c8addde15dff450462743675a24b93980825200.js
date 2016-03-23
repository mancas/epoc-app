var ep = ep || {};

ep.app = (function() {
  "use strict";

  var SlideshowView = React.createClass({displayName: "SlideshowView",
    render: function() {
      return React.createElement("div", null, "Hello");
    }
  });

  function init() {
    var router = new Router();
    Backbone.history.start({ pushState: true });

    var handlers = {
      home: require('build/bootstrap')
    };

    var getHandler = function(name) {
      return handlers[name];
    };

    router.on('route', function(name, params) {
      var route = { name: name, params: params };
      React.render(React.createElement(App, {route: route}), document.querySelector("#main"));
    });
  }

  return {
    init: init,
    SlideshowView: SlideshowView
  }
})();


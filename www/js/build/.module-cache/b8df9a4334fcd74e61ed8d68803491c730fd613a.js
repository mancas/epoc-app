var ep = ep || {};

ep.app = (function() {
  "use strict";

  var App = React.createClass({displayName: "App",
    render: function() {
      console.info(this.props.route);
      return React.createElement("div", null, "Hello");
    }
  });

  function init() {
    console.info("HERE");
    var router = new AppRouter();
    Backbone.history.start({ pushState: true });

    var handlers = {
      home: require('build/slideshow')
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
    App: App
  }
})();

document.addEventListener("DOMContentLoaded", ep.app.init);
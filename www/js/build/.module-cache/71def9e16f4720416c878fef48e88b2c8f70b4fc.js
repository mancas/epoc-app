var ep = ep || {};

ep.app = (function() {
  "use strict";

  var App = React.createClass({displayName: "App",
    onclick: function(event) {
      event.preventDefault();
      AppRouter.navigate('slideshow', {trigger: true});
    },
    render: function() {
      console.info(this.props.route);
      return React.createElement("a", {href: "", onclick: this.onclick}, "Hello");
    }
  });

  function init() {
    console.info("HERE");

    var handlers = {
      slideshow: require(['build/slideshow'])
    };

    var getHandler = function(name) {
      return handlers[name];
    };

    AppRouter.on('route', function(name, params) {
      var route = { name: name, params: params };
      React.render(React.createElement(App, {route: route}), document.querySelector("#main"));
    });

    React.render(React.createElement(App, null), document.querySelector("#main"));
  }

  return {
    init: init,
    App: App
  }
})();

ep.app.init();
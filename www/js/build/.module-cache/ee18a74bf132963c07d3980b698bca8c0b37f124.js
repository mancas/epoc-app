var ep = ep || {};

ep.app = (function() {
  "use strict";

  var App = React.createClass({displayName: "App",
    onclick: function(event) {
      console.info('here', event);
      event.preventDefault();
      AppRouter.navigate('slideshow', {trigger: true});
    },
    render: function() {
      if (!this.props.route.name) {
        return React.createElement("a", {onClick: this.onclick}, "Hello")
      }
      var Handler = AppRouter.getHandler(this.props.route.name || 'home');
      return React.createElement(Handler, {route: this.props.route})
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

    AppRouter.getHandler = getHandler;

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
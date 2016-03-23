var ep = ep || {};

ep.app = (function() {
  "use strict";

  var Link = ReactRouter.Link;
  var RouteHandler = ReactRouter.RouteHandler;
  var DefaultRoute = ReactRouter.DefaultRoute;

  var Header = React.createClass({displayName: "Header",
    render: function() {
      return React.createElement("header", null, "I'm a header");
    }
  });

  var App = React.createClass({displayName: "App",
    render: function() {
      return (
        React.createElement("div", {className: "app"}, 
          React.createElement(Header, null), 

          React.createElement("div", {className: "page"}, 
            React.createElement(RouteHandler, null)
          )
        )
      );
    }
  });

  var routes = (
    React.createElement(Route, {name: "app", handler: App, path: "/"}, 
      React.createElement(Route, {name: "about", path: "/about", handler: AboutPage}), 
      React.createElement(Route, {name: "clock", path: "/clock", handler: ClockPage}), 
      React.createElement(DefaultRoute, {handler: ClockPage})
    )
  );

  Router.run(routes, function(Handler, state) {
    React.render(React.createElement(Handler, null), document.body);
  })

  return {
    init: init,
    App: App
  }
})();

ep.app.init();
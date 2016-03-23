var ep = ep || {};

ep.app = (function() {
  "use strict";
console.info(window);
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

          React.createElement(Link, {to: '/about'}, "Go to about page"), 

          React.createElement("div", {className: "page"}, 
            React.createElement(RouteHandler, null)
          )
        )
      );
    }
  });

  var AboutPage = React.createClass({displayName: "AboutPage",
    render: function() {
      return (
        React.createElement("div", {className: "about"}, 
          "About page"
        )
      );
    }
  });

  var routes = (
    React.createElement(Route, {name: "app", component: App, path: "/"}, 
      React.createElement(Route, {name: "about", path: "/about", component: AboutPage})
    )
  );

  Router.run(routes, function(Handler, state) {
    React.render(React.createElement(Handler, null), document.body);
  })

  return {
    App: App
  }
})();
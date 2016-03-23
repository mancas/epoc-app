var ep = ep || {};

ep.app = (function() {
  "use strict";
console.info(window);
  var Link = ReactRouter.Link;
  var RouteHandler = ReactRouter.RouteHandler;
  var DefaultRoute = ReactRouter.DefaultRoute;
  var Route = ReactRouter.Route;

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

  React.render((
    React.createElement(App, null)
  ), document.querySelector('#main'));

  return {
    App: App
  }
})();
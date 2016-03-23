var ep = ep || {};

ep.app = (function() {
  "use strict";

  var Link = ReactRouter.Link;
  var Route = ReactRouter.Route;
  var Router = ReactRouter.Router;
  var materialViews = ep.materialViews;

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

          React.createElement(Link, {to: 'about'}, "Go to about page"), 

          React.createElement("div", {className: "page"}, 
            this.props.children
          )
        )
      );
    }
  });

  var AboutPage = React.createClass({displayName: "AboutPage",
    render: function() {
      return (
        React.createElement("div", {className: "about"}, 
          "About page", 
          React.createElement(materialViews.RippleButton, {label: "Continue"}), 
          React.createElement(materialViews.Input, {label: "Name", maxLength: 30, required: true})
        )
      );
    }
  });

  React.render((
    React.createElement(Router, null, 
      React.createElement(Route, {path: "/", component: App}, 
        React.createElement(Route, {path: "about", component: AboutPage}), 
        React.createElement(Route, {path: "*", component: AboutPage})
      )
    )
  ), document.querySelector('#main'));

  return {
    App: App
  }
})();
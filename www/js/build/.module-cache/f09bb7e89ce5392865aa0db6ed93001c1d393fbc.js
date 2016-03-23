define([
  "build/materialViews",
  "build/slideshow",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore"],
  function(materialViews, SlideshowView, Actions, Dispatcher, UserStore) {
    "use strict";

    // var Link = ReactRouter.Link;
    var Route = ReactRouter.Route;
    var Router = ReactRouter.Router;
    var dispatcher;
    var userStore;

    var App = React.createClass({displayName: "App",
      propTypes: {
        children: React.PropTypes.node
      },

      render: function() {
        return (
          React.createElement("div", {className: "app"}, 
            React.createElement(SlideshowView, {
              dispatcher: dispatcher}), 

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

    function init() {
      dispatcher = new Dispatcher();
      userStore = new UserStore(dispatcher);
      console.info(userStore);
      React.render((
        React.createElement(Router, null, 
          React.createElement(Route, {component: App, path: "/"}, 
            React.createElement(Route, {component: AboutPage, path: "about"}), 
            React.createElement(Route, {component: AboutPage, path: "*"})
          )
        )
      ), document.querySelector("#container"));
    }

    return {
      App: App,
      init: init
    };
});

define([
  "build/materialViews",
  "build/slideshow",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore"],
  function(materialViews, SlideshowView, Actions, Dispatcher, UserStore) {
    "use strict";

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

    var InterfaceComponent = React.createClass({displayName: "InterfaceComponent",
      componentWillMount : function() {
        this.callback = (function() {
          this.forceUpdate();
        }).bind(this);

        this.props.router.on("route", this.callback);
      },
      componentWillUnmount : function() {
        this.props.router.off("route", this.callback);
      },
      render : function() {
        switch (this.props.router.current) {
          case "foo":
            return (
              React.createElement("div", {className: "app"}, 
                React.createElement(SlideshowView, {
                  dispatcher: dispatcher}), 

                React.createElement("div", {className: "page"}, 
                  this.props.children
                )
              )
            )
          default:
            return null;
        }
      }
    });

    function init() {
      dispatcher = new Dispatcher();
      userStore = new UserStore(dispatcher);

      var Router = Backbone.Router.extend({
        routes : {
          "" : "foo",
          "bar" : "bar"
        },
        foo : function() {
          this.current = "foo";
        },
        bar : function() {
          this.current = "bar";
        }
      });

      var router = new Router();

      React.render(
        React.createElement(InterfaceComponent, {router: router}),
        document.querySelector("#container")
      );

      Backbone.history.start();
    }

    return {
      App: App,
      init: init
    };
});

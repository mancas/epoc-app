define([
  "build/materialViews",
  "build/app",
  "build/slideshow",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore"],
  function(materialViews, appViews, SlideshowView, Actions, Dispatcher, UserStore) {
    "use strict";

    var dispatcher;
    var userStore;

    var InterfaceComponent = React.createClass({
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
          case "slideshow":
            return (
              <div className="app">
                <SlideshowView
                  dispatcher={dispatcher} />

                <div className="page">
                  {this.props.children}
                </div>
              </div>
            );
          case "index":
            return (
              <appViews.AppControllerView />
            );
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
          "" : "index",
          "slideshow" : "slideshow"
        },
        index : function() {
          this.current = "index";
        },
        slideshow : function() {
          this.current = "slideshow";
        }
      });

      var router = new Router();

      React.render(
        <InterfaceComponent router={router} />,
        document.querySelector("#container")
      );

      Backbone.history.start({pushState: true});
    }

    return {
      init: init
    };
});

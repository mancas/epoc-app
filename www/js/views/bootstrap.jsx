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

        //this.props.router.on("route", this.callback);
      },

      componentWillUnmount : function() {
        this.props.router.off("route", this.callback);
      },

      navigate: function (path) {
        this.props.router.navigate(path, {trigger: true});
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
              <appViews.AppControllerView
                navigate={this.navigate}
                router={this.props.router} />
            );
          default:
            return (
              <appViews.AppControllerView
                navigate={this.navigate}
                router={this.props.router} />
            );
        }
      }
    });

    function init() {
      dispatcher = new Dispatcher();
      userStore = new UserStore(dispatcher);

      var Router = Backbone.Router.extend({
        routes : {
          "" : "index",
          "slideshow" : "slideshow",
          "what-is-epoc": "whatIsEpoc",
          "exacerbations": "exacerbations"
        },
        index : function() {
          this.current = "index";
          this.appBarTitle = "My app";
        },
        slideshow : function() {
          this.current = "slideshow";
        },
        whatIsEpoc: function () {
          this.current = "epoc";
          this.appBarTitle = "La EPOC";
        },
        exacerbations: function () {
          this.current = "exacerbations";
          this.appBarTitle = "Exacerbaciones";
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

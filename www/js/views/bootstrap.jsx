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

    var App = React.createClass({
      propTypes: {
        children: React.PropTypes.node
      },

      render: function() {
        return (
          <div className="app">
            <SlideshowView
              dispatcher={dispatcher} />

            <div className="page">
              {this.props.children}
            </div>
          </div>
        );
      }
    });

    var AboutPage = React.createClass({
      render: function() {
        return (
          <div className="about">
            About page
            <materialViews.RippleButton label="Continue" />
            <materialViews.Input label="Name" maxLength={30} required={true} />
          </div>
        );
      }
    });

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
          case "foo":
            return (
              <div className="app">
                <SlideshowView
                  dispatcher={dispatcher} />

                <div className="page">
                  {this.props.children}
                </div>
              </div>
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
        <InterfaceComponent router={router} />,
        document.querySelector("#container")
      );

      Backbone.history.start();
    }

    return {
      App: App,
      init: init
    };
});

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

    function init() {
      dispatcher = new Dispatcher();
      userStore = new UserStore(dispatcher);

      React.render((
        <Router>
          <Route component={App} path="/">
            <Route component={AboutPage} path="about" />
            <Route component={AboutPage} path="*"/>
          </Route>
        </Router>
      ), document.querySelector("#container"));
    }

    return {
      App: App,
      init: init
    };
});

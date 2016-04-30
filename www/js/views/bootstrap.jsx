define([
  "build/materialViews",
  "build/app",
  "build/slideshow",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore",
  "mixins/storeMixin"],
  function(materialViews, appViews, SlideshowView, Actions, Dispatcher, UserStore, StoreMixin) {
    "use strict";

    var dispatcher;
    var userStore;

    var InterfaceComponent = React.createClass({
      propTypes: {
        userStore: React.PropTypes.instanceOf(UserStore).isRequired
      },

      componentDidMount : function() {
        if (localStorage.getItem("introSeen") === null) {
          this.props.userStore.on("change", this.storeStateChange);
          this.navigate("#slideshow");
          this.forceUpdate();
        }
      },

      storeStateChange: function() {
        this.navigate("");
        this.forceUpdate();
        this.props.userStore.off("change", this.storeStateChange);
      },

      shouldComponentUpdate: function(nextProps) {
        return nextProps.router.current !== "slideshow";
      },

      navigate: function (path) {
        this.props.router.navigate(path, {trigger: true});
      },

      render : function() {
        console.info(this.props.router.current);
        switch (this.props.router.current) {
          case "slideshow":
            return (
              <div className="app">
                <SlideshowView
                  dispatcher={dispatcher} />
              </div>
            );
          default:
            dispatcher.dispatch(new Actions.UpdateUserData({
              "userName": "Manu",
              "gradeEPOC": "A",
              "lastRevision": "Thu Apr 28 2016 14:05:31 GMT+0200 (CEST)",
              "isSmoker": 1,
              "weight": 80,
              "height": 182,
              "birth": "Thu Apr 28 1991 14:05:31 GMT+0200 (CEST)"
            }));
            return (
              <appViews.AppControllerView
                dispatcher={dispatcher}
                navigate={this.navigate}
                router={this.props.router} />
            );
        }
      }
    });

    function init() {
      dispatcher = new Dispatcher();
      userStore = new UserStore(dispatcher);
      // For testing purpose
      //localStorage.removeItem("introSeen");

      StoreMixin.register({
        userStore: userStore
      });

      var Router = Backbone.Router.extend({
        routes : {
          "" : "index",
          "slideshow" : "slideshow",
          "what-is-epoc": "whatIsEpoc",
          "exacerbations": "exacerbations",
          "do-not-smoke": "smoker"
        },
        index : function() {
          this.current = "index";
          this.appBarTitle = "My app";
        },
        slideshow : function() {
          this.current = "slideshow";
          console.info(this.current);
        },
        whatIsEpoc: function () {
          this.current = "epoc";
          this.appBarTitle = "La EPOC";
        },
        exacerbations: function () {
          this.current = "exacerbations";
          this.appBarTitle = "Exacerbaciones";
        },
        smoker: function () {
          this.current = "smoker";
          this.appBarTitle = "El tabaco y la EPOC";
        }
      });

      var router = new Router();
      Backbone.history.start({pushState: true});

      React.render(
        <InterfaceComponent
          router={router}
          userStore={userStore} />,
        document.querySelector("#container")
      );
    }

    return {
      init: init
    };
});

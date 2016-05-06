define([
  "build/materialViews",
  "build/app",
  "build/slideshow",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore",
  "stores/alarmStore",
  "stores/notificationStore",
  "mixins/storeMixin"],
  function(materialViews, appViews, SlideshowView, Actions, Dispatcher, UserStore, AlarmStore, NotificationStore, StoreMixin) {
    "use strict";

    var dispatcher;

    var InterfaceComponent = React.createClass({
      propTypes: {
        userStore: React.PropTypes.instanceOf(UserStore).isRequired
      },

      componentDidMount : function() {
        if (localStorage.getItem("introSeen") === null) {
          this.props.userStore.on("change", this.storeStateChange);
          this.navigate("#slideshow");
        } else {
          this.navigate("");
        }
        this.forceUpdate();
      },

      storeStateChange: function() {
        if (!this.props.userStore.getStoreState("appReady")) {
          return;
        }
        this.navigate("");
        this.forceUpdate();
        this.props.userStore.off("change", this.storeStateChange);
      },

      shouldComponentUpdate: function(nextProps) {
        return nextProps.router.current !== "slideshow";
      },

      navigate: function (path) {
        this.props.router.navigate(path, {trigger: true});
        window.scrollTo(0, 0);
      },

      render : function() {
        switch (this.props.router.current) {
          case "slideshow":
            return (
              <div className="app">
                <SlideshowView
                  dispatcher={dispatcher} />
              </div>
            );
          default:
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
      var userStore = new UserStore(dispatcher);
      var alarmStore = new AlarmStore(dispatcher);
      var notificationStore = new NotificationStore(dispatcher);
      // For testing purpose
      //localStorage.removeItem("introSeen");
console.info(notificationStore);
      StoreMixin.register({
        alarmStore: alarmStore,
        notificationStore: notificationStore,
        userStore: userStore
      });

      var Router = Backbone.Router.extend({
        routes : {
          "" : "index",
          "slideshow" : "slideshow",
          "what-is-epoc": "whatIsEpoc",
          "exacerbations": "exacerbations",
          "do-not-smoke": "smoker",
          "my-alarms": "alarms"
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
        },
        alarms: function() {
          this.current = "alarms";
          this.appBarTitle = "Mis alarmas";
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

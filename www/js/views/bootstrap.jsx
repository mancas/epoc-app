define([
  "build/materialViews",
  "build/app",
  "build/slideshow",
  "build/epocTest",
  "slideshowData",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore",
  "stores/alarmStore",
  "stores/notificationStore",
  "mixins/storeMixin"],
  function(materialViews, appViews, slideshowViews, epocTest, slideshowData, Actions, Dispatcher,
           UserStore, AlarmStore, NotificationStore, StoreMixin) {
    "use strict";

    var InterfaceComponent = React.createClass({
      propTypes: {
        dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
        userStore: React.PropTypes.instanceOf(UserStore).isRequired
      },

      componentDidMount : function() {
        if (localStorage.getItem("introSeen") === null) {
          this.props.userStore.on("change", this.storeStateChange);
          this.navigate("#epoc-test");
        } else {
          this.navigate("#index");
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
        // return nextProps.router.current !== "slideshow";
        return true;
      },

      navigate: function (path) {
        this.props.router.navigate(path, {trigger: true});
        window.scrollTo(0, 0);
      },

      render : function() {
        switch (this.props.router.current) {
          case "introduction":
            return (
              <appViews.IntroScreenView
                navigate={this.navigate} />
            );
          case "test":
            return (
              <epocTest.EpocTestController
                dispatcher={this.props.dispatcher}
                router={this.props.router} />
            );
          case "slideshow":
            return (
              <div className="app">
                <SlideShowTutorialView
                  dispatcher={this.props.dispatcher} />
              </div>
            );
          default:
            return (
              <appViews.AppControllerView
                dispatcher={this.props.dispatcher}
                navigate={this.navigate}
                router={this.props.router} />
            );
        }
      }
    });

    var SlideShowTutorialView = React.createClass({
      propTypes: {
        dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired
      },

      _setupApp: function (model) {
        localStorage.setItem("introSeen", "true");
        this.props.dispatcher.dispatch(new Actions.CreateUser(model));
        this.props.dispatcher.dispatch(new Actions.SetupApp(model));
      },

      render: function() {
        return (
          <slideshowViews.SlideshowView
            model={slideshowData.model}
            onFinish={this._setupApp}
            slides={slideshowData.slides} />
        );
      }
    });

    function init() {
      var dispatcher = new Dispatcher();
      var userStore = new UserStore(dispatcher);
      var alarmStore = new AlarmStore(dispatcher);
      var notificationStore = new NotificationStore(dispatcher);
      // For testing purpose
      //localStorage.removeItem("introSeen");

      StoreMixin.register({
        alarmStore: alarmStore,
        notificationStore: notificationStore,
        userStore: userStore
      });

      var Router = Backbone.Router.extend({
        routes : {
          "introduction" : "introduction",
          "index": "index",
          "epoc-test": "test",
          "slideshow" : "slideshow",
          "what-is-epoc": "whatIsEpoc",
          "exacerbations": "exacerbations",
          "do-not-smoke": "smoker",
          "my-alarms": "alarms",
          "inhalers(/:inhalerType)": "inhalers"
        },
        index : function() {
          this.current = "index";
          this.appBarTitle = "My app";
        },
        introduction: function() {
          this.current = "introduction";
        },
        test: function() {
          this.current = "test";
          this.appBarTitle = "Test de riesgo";
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
        },
        smoker: function () {
          this.current = "smoker";
          this.appBarTitle = "El tabaco y la EPOC";
        },
        alarms: function() {
          this.current = "alarms";
          this.appBarTitle = "Mis alarmas";
        },
        inhalers: function(inhalerType) {
          this.current = "inhalers";
          this.appBarTitle = "Los inhaladores";
          this.inhalerType = inhalerType;
        }
      });

      var router = new Router();
      Backbone.history.start({pushState: true});

      React.render(
        <InterfaceComponent
          dispatcher={dispatcher}
          router={router}
          userStore={userStore} />,
        document.querySelector("#container")
      );
    }

    return {
      init: init
    };
});

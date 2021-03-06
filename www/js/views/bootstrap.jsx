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
  "stores/bloodSaturationStore",
  "stores/notificationStore",
  "stores/exercisesDiaryStore",
  "stores/snackbarStore",
  "mixins/storeMixin",
  "utils/dateTime",
  "utils/utilities"],
  function(materialViews, appViews, slideshowViews, epocTest, slideshowData, Actions, Dispatcher,
           UserStore, AlarmStore, BloodSaturationStore, NotificationStore, ExercisesDiaryStore, SnackbarStore,
           StoreMixin, DateTimeHelper, utils) {
    "use strict";

    var InterfaceComponent = React.createClass({
      propTypes: {
        dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
        userStore: React.PropTypes.instanceOf(UserStore).isRequired
      },

      componentWillMount: function() {
        var lastTest = localStorage.getItem("nutritionTest");
        if (lastTest === null) {
          return;
        }

        var lastTestDate = new Date(parseInt(lastTest));
        var nextTestDate = DateTimeHelper.addMonths(lastTestDate, 3);

        var today = new Date();
        if (today.getTime() >= nextTestDate.getTime()) {
          this.props.dispatcher.dispatch(new Actions.UpdateNotification({
            type: utils.NOTIFICATION_TYPES.NUTRITION_TEST,
            read: 0
          }));
        }

        document.addEventListener("backbutton", this.handleBackButton);
      },

      componentWillUnmount : function() {
        this.props.router.off("route", this.routerCallback);
        document.removeEventListener("backbutton", this.handleBackButton);
      },

      handleBackButton: function(event) {
        event.preventDefault();
        if (this.props.router.current !== "index") {
          window.history.back();
        } else {
          navigator.app.exitApp();
        }
      },

      componentDidMount : function() {
        if (localStorage.getItem("introSeen") === null) {
          this.props.userStore.on("change:appReady", this.storeStateChange);
          this.navigate("#introduction");
          this.props.router.on("route", this.routerCallback);
        } else {
          this.navigate("#index");
        }
        this.forceUpdate();
      },

      routerCallback: function() {
        this.forceUpdate();
      },

      storeStateChange: function() {
        if (!this.props.userStore.getStoreState("appReady")) {
          return;
        }
        this.navigate("#index");
        this.forceUpdate();
        this.props.userStore.off("change:appReady", this.storeStateChange);
        this.props.router.off("route", this.routerCallback);
      },

      navigate: function (path) {
        this.props.router.navigate(path, {trigger: true});
        window.scrollTo(0, 0);
      },

      render : function() {
        if (!this.props.router.current) {
          return null;
        }

        switch (this.props.router.current) {
          case "introduction":
            return (
              <appViews.IntroScreenView
                navigate={this.navigate} />
            );
          case "test":
            return (
              <epocTest.EpocTestController
                navigate={this.navigate}
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
      var bloodSaturationStore = new BloodSaturationStore(dispatcher);
      var snackbarStore = new SnackbarStore(dispatcher);
      var exercisesDiaryStore = new ExercisesDiaryStore(dispatcher);
      // For testing purpose
      //localStorage.removeItem("introSeen");

      StoreMixin.register({
        alarmStore: alarmStore,
        bloodSaturationStore: bloodSaturationStore,
        exercisesDiaryStore: exercisesDiaryStore,
        notificationStore: notificationStore,
        userStore: userStore,
        snackbarStore: snackbarStore
      });

      var Router = Backbone.Router.extend({
        routes : {
          "introduction" : "introduction",
          "index": "index",
          "app-information": "appInformation",
          "epoc-test(/:section)": "test",
          "slideshow" : "slideshow",
          "what-is-epoc": "whatIsEpoc",
          "exacerbations": "exacerbations",
          "do-not-smoke": "smoker",
          "my-alarms": "alarms",
          "inhalers(/:inhalerType)": "inhalers",
          "my-nutrition(/:sectionId)": "nutrition",
          "nutrition-test": "nutritionTest",
          "exacerbation-test(/:section)": "exacerbationTest",
          "vaccines": "vaccines",
          "my-exercises(/:sectionId)": "exercises",
          "my-exercises-diary(/:recordId)": "exercisesDiary"
        },
        index : function() {
          this.current = "index";
          this.appBarTitle = "EPOCFY";
        },
        introduction: function() {
          this.current = "introduction";
        },
        test: function(section) {
          this.current = "test";
          this.appBarTitle = !section ? "Test de riesgo" : "Test de riesgo: Información";
          this.showInfo = !!section;
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
        },
        nutrition: function(sectionId) {
          this.current = "nutrition";
          this.appBarTitle = "Mi nutrición";
          this.sectionId = sectionId;
        },
        nutritionTest: function() {
          this.current = "nutrition-test";
          this.appBarTitle = "Test de nutrición";
        },
        exacerbationTest: function(section) {
          this.current = "exacerbation-test";
          this.appBarTitle = !section ? "¿Cómo me encuentro?" : "Test: Información";
          this.showInfo = !!section;
        },
        appInformation: function() {
          this.current = "app-information";
          this.appBarTitle = "Acerca de la app";
        },
        vaccines: function() {
          this.current = "vaccines";
          this.appBarTitle = "Vacunas y la EPOC";
        },
        exercises: function(sectionId) {
          this.current = "exercises";
          this.appBarTitle = "Ejercicio físico";
          this.sectionId = sectionId;
        },
        exercisesDiary: function(recordId) {
          this.current = "exercises-diary";
          this.appBarTitle = "Diario de caminatas";
          this.recordId = recordId;
        }
      });

      var router = new Router();
      Backbone.history.start({pushState: true});

      ReactDOM.render(
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

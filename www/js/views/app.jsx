define([
  "build/materialViews",
  "build/epocViews",
  "build/epocTest",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore",
  "mixins/storeMixin",
  "utils/databaseManager",
  "data/sections",
  "build/exacerbationTest"
], function(materialViews, epocViews, epocTest, Actions, Dispatcher,
            UserStore, StoreMixin, dbManager, AppSections, exacerbationTestViews) {
  "use strict";

  var AppControllerView = React.createClass({
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      navigate: React.PropTypes.func.isRequired,
      router: React.PropTypes.object.isRequired
    },

    componentWillMount : function() {
      this.routerCallback = (function() {
        this.forceUpdate();
      }).bind(this);

      this.props.router.on("route", this.routerCallback);
    },

    componentWillUnmount : function() {
      this.props.router.off("route", this.routerCallback);
    },

    getInitialState: function() {
      return {
        selectedTab: 0
      };
    },

    onTabChange: function(tab) {
      this.setState({
        selectedTab: tab
      });
    },

    handleInfoClick: function() {
      var url;
      switch (this.props.router.current) {
        case "test":
          url = "#epoc-test/information";
          break;
        case "exacerbation-test":
          url = "#exacerbation-test/information";
          break;
        default:
          url = "#app-information";
          break;
      }
      this.props.navigate(url);
    },

    _shouldShowInfoButton: function() {
      // Just display the info button in index or test screen
      return (
        this.props.router.current === "index" ||
        this.props.router.current === "test" ||
        this.props.router.current === "exacerbation-test");
    },

    render: function() {
      return (
        <div className="app">
          <AppBarView
            handleInfoClick={this.handleInfoClick}
            onTabChange={this.onTabChange}
            router={this.props.router}
            showInfoButton={this._shouldShowInfoButton()} />
          <div className="app-content" >
            <AppContentView
              dispatcher={this.props.dispatcher}
              router={this.props.router}
              navigate={this.props.navigate}
              selectedTab={this.state.selectedTab} />
          </div>
          <materialViews.SnackbarView />
        </div>
      );
    }
  });

  var AppBarView = React.createClass({
    propTypes: {
      handleInfoClick: React.PropTypes.func,
      onTabChange: React.PropTypes.func.isRequired,
      router: React.PropTypes.object.isRequired,
      showInfoButton: React.PropTypes.bool.isRequired
    },

    render: function() {
      return (
        <materialViews.AppBarView
          currentRoute={this.props.router.current}
          infoCallback={this.props.handleInfoClick}
          showInfoButton={this.props.showInfoButton}
          title={this.props.router.appBarTitle}
          zIndex={2}>
          <materialViews.TabsView
            onChange={this.props.onTabChange}>
            <materialViews.TabView>
              <img src="img/material/apps.svg" />
            </materialViews.TabView>
            <materialViews.TabView>
              <img src="img/material/chart.svg" />
            </materialViews.TabView>
            <materialViews.TabView>
              <img src="img/material/profile.svg" />
            </materialViews.TabView>
          </materialViews.TabsView>
        </materialViews.AppBarView>
      );
    }
  });

  var AppContentView = React.createClass({
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      navigate: React.PropTypes.func.isRequired,
      router: React.PropTypes.object.isRequired,
      selectedTab: React.PropTypes.number.isRequired
    },

    renderTabContent: function() {
      return (
        <materialViews.TabsContent
          selectedTab={this.props.selectedTab}>
          <materialViews.TabContentView>
            <NotificationsView
              dispatcher={this.props.dispatcher} />
            <AppSectionsView
              handleClick={this.props.navigate} />
          </materialViews.TabContentView>
          <materialViews.TabContentView>
            <epocViews.ChartView
              dispatcher={this.props.dispatcher} />
          </materialViews.TabContentView>
          <materialViews.TabContentView>
            <epocViews.UserProfileView
              dispatcher={this.props.dispatcher} />
          </materialViews.TabContentView>
        </materialViews.TabsContent>
      );
    },

    render: function() {
      switch (this.props.router.current) {
        case "index":
          return this.renderTabContent();
        case "epoc":
          return (
            <epocViews.WhatIsEpocView />
          );
        case "exacerbations":
          return (
            <epocViews.ExacerbationsView />
          );
        case "smoker":
          return (
            <epocViews.EPOCAndSmokersView />
          );
        case "alarms":
          return (
            <epocViews.MyAlarmsView
              dispatcher={this.props.dispatcher} />
          );
        case "inhalers":
          return (
            <epocViews.InhalersView
              navigate={this.props.navigate}
              router={this.props.router} />
          );
        case "test":
          return (
            <div className="epoc-test">
            <epocTest.EpocTestContent
              router={this.props.router} />
            </div>
          );
        case "nutrition":
          return (
            <epocViews.MyNutritionView
              dispatcher={this.props.dispatcher}
              navigate={this.props.navigate}
              router={this.props.router} />
          );
        case "nutrition-test":
          return (
            <epocViews.NutritionTestView
              dispatcher={this.props.dispatcher}
              router={this.props.router} />
          );
        case "exacerbation-test":
          return (
            <exacerbationTestViews.ExacerbationTestController
              dispatcher={this.props.dispatcher}
              router={this.props.router} />
          );
        case "app-information":
          return (
            <AppInfoView />
          );
        case "vaccines":
          return (
            <epocViews.VaccinesView />
          );
        case "exercises":
          return (
            <epocViews.ExercisesView
              navigate={this.props.navigate}
              router={this.props.router} />
          );
        default:
          return null;
      }
    }
  });

  var SectionView = React.createClass({
    propTypes: {
      handleClick: React.PropTypes.func,
      section: React.PropTypes.object.isRequired
    },

    shouldComponentUpdate: function () {
      return false;
    },

    generateIconPath: function() {
      return "img/" + this.props.section.icon + ".svg";
    },

    handleClick: function() {
      this.props.handleClick && this.props.handleClick(this.props.section.path);
    },

    render: function() {
      const extraCSSClasses = {
        "borderless": true,
        "section-btn": true
      };

      return (
        <materialViews.RippleButton
          extraCSSClasses={extraCSSClasses}
          handleClick={this.handleClick}
          label={this.props.section.name}>
          <img src={this.generateIconPath()} />
        </materialViews.RippleButton>
      );
    }
  });

  var AppSectionsView = React.createClass({
    mixins: [
      StoreMixin("userStore")
    ],

    propTypes: {
      handleClick: React.PropTypes.func
    },

    getInitialState: function() {
      return this.getStore().getStoreState();
    },

    render: function() {
      return (
        <div className="app-sections">
          {
            AppSections.map(function(section, index) {
              if (section.isEnabled) {
                var allowRender = true;
                for (var key in section.isEnabled) {
                  switch (typeof section.isEnabled[key]) {
                    case "boolean":
                      if (section.isEnabled[key]) {
                        allowRender = this.state[key] ? true : false;
                      } else {
                        allowRender = this.state[key] ? false : true;
                      }
                      break;
                    default:
                      if (this.state[key] !== section.isEnabled[key]) {
                        allowRender = false;
                      }
                      break;
                  }
                }

                if (!allowRender) {
                  return null;
                }
              }
              return (
                <SectionView
                  key={index}
                  handleClick={this.props.handleClick}
                  section={section} />
              );
            }, this)
          }
        </div>
      );
    }
  });

  var NotificationsView = React.createClass({
    mixins: [
      StoreMixin("notificationStore")
    ],

    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired
    },

    getInitialState: function() {
      return this.getStore().getStoreState();
    },

    componentDidUpdate: function() {
      var wrapper = this.refs.notificationsWrapper;
      if (!wrapper) {
        return;
      }

      wrapper.classList.remove("fade-out");
    },

    onAnimationEnd: function() {
      this.props.dispatcher.dispatch(new Actions.UpdateNotification({
        id: this.state.notifications[0].id,
        read: 1
      }));
    },

    onClick: function() {
      var wrapper = this.refs.notificationsWrapper;
      wrapper.classList.add("fade-out");
    },

    render: function(){
      if (!this.state.notifications || !this.state.notifications.length) {
        return null;
      }

      return (
        <div className="app-notifications">
          <div
            className="notificaiton-wrapper"
            onAnimationEnd={this.onAnimationEnd}
            ref="notificationsWrapper">
            <materialViews.CardView
              data={this.state.notifications[0]}
              onClick={this.onClick} />
          </div>
        </div>
      );
    }
  });

  var IntroScreenView = React.createClass({
    propTypes: {
      navigate: React.PropTypes.func.isRequired
    },

    navigateToEPOCTest: function() {
      this.props.navigate("#epoc-test");
    },

    navigateToSlideshow: function() {
      this.props.navigate("#slideshow");
    },

    render: function() {
      return (
        <div className="intro-screen">
          <img className="logo-icon" src="img/logo.svg" />
          <h1>¡Bienvenido!</h1>
          <p>
            APPNAME te ayudará en tu día a día para mejorar tu calidad de
            vida. ¿Padeces EPOC o crees que puedes tener la enfermedad?
          </p>
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.navigateToSlideshow}
            label="Sí, padezco EPOC" />
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.navigateToEPOCTest}
            label="No estoy seguro" />
        </div>
      );
    }
  });

  var AppInfoView = React.createClass({
    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      return (
        <div className="section-info">
          <h1>EPOCFY</h1>
          <p>
            Esta aplicación tiene como principal objetivo ayudar a los pacientes de EPOC en su día a día, mediante el
            conocimiento de la enfermedad y los consejos para mejorar la calidad de vida.
          </p>
          <p>
            Puedes encontrar diferentes test para medir tu nutrición, si tienes o no una exacerbación y para comprobar
            si una persona pudiese tener algún grado de EPOC.
          </p>
          <p>
            <b>
              La información ofrecida en la aplicación, en ningún momento debe tomarse como remplazo de
              la opinión de un profesional del sector.
            </b>
          </p>
          <h1>Material didáctico</h1>
          <p>
            Toda la información presente en la aplicación ha sido tomada de manuales médicos y articulos
            científicos publicados de forma digital.
          </p>
          <p>
            Los diferentes tests son fruto del tabajo de esas investigaciones y puede encontrarse información más
            detallada en cada una de las secciones de información de cada test.
          </p>
          <h1>Material visual</h1>
          <p>
            La mayor parte de los iconos de la aplicación pertenecen a <b>Freepik</b>, y son utilizados bajo la
            licencia <b>Flaticon Basic License</b>. El resto son propios de la aplicación o iconos utilizados por <b>Google</b>
            en su sistema operativo.
          </p>
          <h1>
            Reporte de errores
          </h1>
          <p>
            Si tienes algún problema con la app, puedes contactar con el equipo técnico a través de este correo electrónico:
            <a href="mailto:mancas.91@gmail.com">mancas.91@gmail.com</a>
          </p>
          <p>
            No olvides describir el problema detalladamente para que podamos ayudarte.
          </p>
        </div>
      );
    }
  });

  return {
    AppControllerView: AppControllerView,
    IntroScreenView: IntroScreenView
  };
});

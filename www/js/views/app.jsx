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
  "_"
], function(materialViews, epocViews, epocTest, Actions, Dispatcher, UserStore, StoreMixin, dbManager, AppSections, _) {
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
        default:
          url = "#index/information";
          break;
      }
      this.props.navigate(url);
    },

    _shouldShowInfoButton: function() {
      // Just display the info button in index or test screen
      return (this.props.router.current === "index" || this.props.router.current === "test");
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

    componentDidMount: function() {
      var notification = this.refs.currentNotification.getDOMNode();
      if (!notification) {
        return;
      }

      notification.addEventListener("animationend", this.onAnimationEnd);
    },

    componentWillUnmount: function() {
      var notification = this.refs.currentNotification.getDOMNode();
      if (!notification) {
        return;
      }

      notification.removeEventListener("animationend", this.onAnimationEnd);
    },

    componentDidUpdate: function() {
      var notification = this.refs.currentNotification;
      if (!notification) {
        return;
      }

      notification.getDOMNode().classList.remove("fade-out");
    },

    onAnimationEnd: function() {
      this.props.dispatcher.dispatch(new Actions.UpdateNotification({
        id: this.state.notifications[0].id,
        read: 1
      }));
    },

    onClick: function() {
      var notification = this.refs.currentNotification.getDOMNode();
      notification.classList.add("fade-out");
    },

    render: function(){
      if (!this.state.notifications || !this.state.notifications.length) {
        return null;
      }

      return (
        <div className="app-notifications">
          <materialViews.CardView
            data={this.state.notifications[0]}
            onClick={this.onClick}
            ref="currentNotification" />
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
          <h1>Bienvenido a APPNAME</h1>
          <p>
            ¿Padeces EPOC o crees que puedes tener la enfermedar? APPNAME
            te ayudará en tu día a día para mejorar tu calidad de vida.
          </p>
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.navigateToEPOCTest}
            label="Realizar test de riesgo" />
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.navigateToSlideshow}
            label="Padezco la EPOC" />
        </div>
      );
    }
  });

  return {
    AppControllerView: AppControllerView,
    IntroScreenView: IntroScreenView
  };
});

define([
  "build/materialViews",
  "build/epocViews",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore",
  "data/sections"
], function(materialViews, epocViews, Actions, Dispatcher, UserStore, AppSections) {
  "use strict";

  var AppControllerView = React.createClass({
    propTypes: {
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

    render: function() {
      return (
        <div className="app">
          <AppBarView
            router={this.props.router}
            onTabChange={this.onTabChange} />
          <div className="app-content" >
            <AppContentView
              currentRoute={this.props.router.current || "index"}
              navigate={this.props.navigate}
              selectedTab={this.state.selectedTab} />
          </div>
        </div>
      );
    }
  });

  var AppBarView = React.createClass({
    propTypes: {
      onTabChange: React.PropTypes.func.isRequired,
      router: React.PropTypes.object.isRequired
    },

    render: function() {
      return (
        <materialViews.AppBarView
          currentRoute={this.props.router.current}
          title={this.props.router.appBarTitle}
          zIndex={2}>
          <materialViews.TabsView
            onChange={this.props.onTabChange}>
            <materialViews.TabView>
              <img src="../../img/material/apps.svg" />
            </materialViews.TabView>
            <materialViews.TabView>
              <img src="../../img/material/chart.svg" />
            </materialViews.TabView>
            <materialViews.TabView>
              <img src="../../img/material/profile.svg" />
            </materialViews.TabView>
          </materialViews.TabsView>
        </materialViews.AppBarView>
      );
    }
  });

  var AppContentView = React.createClass({
    propTypes: {
      currentRoute: React.PropTypes.string.isRequired,
      navigate: React.PropTypes.func.isRequired,
      selectedTab: React.PropTypes.number.isRequired
    },

    renderTabContent: function() {
      return (
        <materialViews.TabsContent
          selectedTab={this.props.selectedTab}>
          <materialViews.TabContentView>
            <materialViews.CardView />
            <AppSectionsView
              handleClick={this.props.navigate} />
          </materialViews.TabContentView>
          <materialViews.TabContentView>
            <materialViews.CardView />
          </materialViews.TabContentView>
          <materialViews.TabContentView>
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
            <materialViews.CardView />
          </materialViews.TabContentView>
        </materialViews.TabsContent>
      );
    },

    render: function() {
      switch (this.props.currentRoute) {
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

    generateIconPath: function() {
      return "../../img/" + this.props.section.icon + ".svg";
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
    propTypes: {
      handleClick: React.PropTypes.func
    },

    render: function() {
      return (
        <div className="app-sections">
          {
            AppSections.map(function(section, index) {
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

  return {
    AppControllerView: AppControllerView
  };
});

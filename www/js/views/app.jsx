define([
  "build/materialViews",
  "utils/actions",
  "utils/dispatcher",
  "stores/userStore"
], function(materialViews, Actions, Dispatcher, UserStore) {
  "use strict";

  var AppControllerView = React.createClass({
    propTypes: {

    },

    render: function() {
      return (
        <div className="app">
          <materialViews.AppBarView
            title="My app"
            zIndex={2}>
            <materialViews.TabsView>
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
          <materialViews.TabsContent>
            <materialViews.TabContentView selected={true}>
              <materialViews.CardView />
              <materialViews.CardView />
              <materialViews.CardView />
              <materialViews.CardView />
              <materialViews.CardView />
              <materialViews.CardView />
              <materialViews.CardView />
            </materialViews.TabContentView>
          </materialViews.TabsContent>
        </div>
      );
    }
  });

  return {
    AppControllerView: AppControllerView
  };
});

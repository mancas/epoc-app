var ep = ep || {};

ep.app = (function() {
  "use strict";

  var SlideshowView = React.createClass({displayName: "SlideshowView",
    render: function() {
      return React.createElement("div", null, "Hello");
    }
  });

  function init() {

  }

  return {
    init: init,
    SlideshowView: SlideshowView
  }
})();
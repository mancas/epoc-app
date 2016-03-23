var ep = ep || {};

ep.app = (function() {
  "use strict";

  return React.createClass({
    render: function() {
      return React.createElement("div", {className: "hello"}, "Heloo");
    }
  });
})();
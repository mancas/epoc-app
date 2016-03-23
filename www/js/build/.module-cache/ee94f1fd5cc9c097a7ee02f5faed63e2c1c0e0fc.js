(function() {
  "use strict";
console.info(window.React);
  return window.React.createClass({
    render: function() {
      return React.createElement("div", {className: "hello"}, "Heloo");
    }
  });
})();
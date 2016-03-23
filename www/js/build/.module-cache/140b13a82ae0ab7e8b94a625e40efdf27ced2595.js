(function() {
  "use strict";
console.info(window);
  return window.React.createClass({
    render: function() {
      return React.createElement("div", {className: "hello"}, "Heloo");
    }
  });
})();
(function() {
  console.info(window);
  return React.createClass({
    render: function() {
      return React.createElement("div", {className: "hello"}, "Heloo");
    }
  });
})();
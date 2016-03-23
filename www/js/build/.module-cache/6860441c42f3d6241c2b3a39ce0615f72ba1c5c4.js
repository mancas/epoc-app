var ep = ep || {};

ep.epocViews = (function() {
  "use strict";

  var MaterialViews

  var ChoiceButton = React.createClass({displayName: "ChoiceButton",
    render: function() {
      return (
        React.createElement("div", {className: "choice-button"}, 
          React.createElement("input", {type: "radio", class: "hidden", name: this.props.choiceName}), 
          React.createElement("ep-button", {class: "btn-dark", "ng-click": "select($event)"}, 
            React.createElement("ng-transclude", null)
          )
        )
      );
    }
  });

  return {

  };
})();
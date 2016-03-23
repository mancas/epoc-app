var ep = ep || {};

ep.epocViews = (function() {
  "use strict";

  var materialViews = ep.materialViews;

  var ChoiceButton = React.createClass({displayName: "ChoiceButton",
    render: function() {
      return (
        React.createElement("div", {className: "choice-button"}, 
          React.createElement("input", {type: "radio", class: "hidden", name: this.props.choiceName}), 
          React.createElement(materialViews.RippleButton, {
            extraClasses: this.props.extraClasses, 
            label: this.props.label, 
            onClick: this.select})
        )
      );
    }
  });

  return {

  };
})();
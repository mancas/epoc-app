var ep = ep || {};

ep.epocViews = (function() {
  "use strict";

  var materialViews = ep.materialViews;

  var ChoiceButton = React.createClass({displayName: "ChoiceButton",
    propTypes: {
      choiceName: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string,
      required: React.PropTypes.bool
    },

    render: function() {
      return (
        React.createElement("div", {className: "choice-button"}, 
          React.createElement("input", {type: "radio", class: "hidden", name: this.props.choiceName}), 
          React.createElement(materialViews.RippleButton, {
            extraCSSClass: this.props.extraCSSClass, 
            label: this.props.label, 
            onClick: this.props.onClick})
        )
      );
    }
  });

  return {

  };
})();
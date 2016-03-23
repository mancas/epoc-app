var ep = ep || {};

ep.epocViews = (function() {
  "use strict";

  var materialViews = ep.materialViews;

  var ChoicesView = React.createClass({displayName: "ChoicesView",
    propTypes: {
      choices: React.PropTypes.object.isRequired,
      choiceName: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string
    },

    select: function() {

    },

    render: function() {
      var cssClasses = {
        "choices": true
      };

      if (this.props.extraCSSClass) {
        cssClasses[this.props.extraCSSClass] = true;
      }
      return (
        React.createElement("div", {className: classNames(cssClasses)}, 
          
            this.props.choices.map(function(choice, i) {
              return (
                React.createElement(ChoiceButton, {
                  choiceName: this.props.choiceName, 
                  label: choice.label, 
                  extraCSSClass: choice.extraCSSClass, 
                  onClick: this.select})
              );
            }, this)
          
        )
      );
    }
  });

  var ChoiceButton = React.createClass({displayName: "ChoiceButton",
    propTypes: {
      choiceName: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string,
      onClick: React.PropTypes.func
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
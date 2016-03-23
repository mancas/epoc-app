define(["build/materialViews", "utils"], function(materialViews, utils) {
  "use strict";

  var ChoicesView = React.createClass({displayName: "ChoicesView",
    propTypes: {
      choices: React.PropTypes.array.isRequired,
      choiceName: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string
    },

    select: function(event) {
      var currentChoice = this.getDOMNode().querySelector(".choices .selected");
      console.info(currentChoice);

      if (currentChoice) {
        currentChoice.classList.remove("selected");
        var currentCheckbox = currentChoice.previousElementSibling;
        currentCheckbox.checked = false;
      }

      var target = event.target;
      if (target.nodeName !== "BUTTON") {
        target = utils.closest(target, "BUTTON");
      }
      target.classList.add("selected");
      var checkbox = utils.closest(target, "input");
      checkbox.checked = true;
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
          
            this.props.choices.map(function(choice, index) {
              return (
                React.createElement(ChoiceButton, {
                  choiceName: this.props.choiceName, 
                  extraCSSClass: choice.extraCSSClass, 
                  handleClick: this.select, 
                  key: index, 
                  label: choice.label})
              );
            }, this)
          
        )
      );
    }
  });

  var ChoiceButton = React.createClass({displayName: "ChoiceButton",
    propTypes: {
      choiceName: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string,
      handleClick: React.PropTypes.func,
      label: React.PropTypes.string.isRequired
    },

    render: function() {
      return (
        React.createElement("div", {className: "choice-button"}, 
          React.createElement("input", {className: "hidden", name: this.props.choiceName, type: "radio"}), 
          React.createElement(materialViews.RippleButton, {
            extraCSSClass: this.props.extraCSSClass, 
            handleClick: this.props.handleClick, 
            label: this.props.label})
        )
      );
    }
  });

  return {
    ChoiceButton: ChoiceButton,
    ChoicesView: ChoicesView
  };
});

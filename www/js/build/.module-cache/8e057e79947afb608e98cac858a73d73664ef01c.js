var ep = ep || {};

ep.materialViews = (function() {
  var RippleButton = React.createClass({displayName: "RippleButton",
    propTypes: {
      label: React.PropTypes.string
    },

    rippleElement: null,
    diagonal: null,

    componentDidMount: function() {
      this.rippleElement = this.getDOMNode().querySelector(".ripple-effect");
      this.getDOMNode().addEventListener("touchstart", this.onTouchStart);
    },

    onTouchStart: function(event) {
      var elementBoundingClientRect = this.getDOMNode().getBoundingClientRect();
      // Stop the previous animation in case of a
      // quick double click
      this.rippleElement.classList.remove('animate');

      // If it's the first time the user click the button,
      // width and height parameters must be set
      if (!this.rippleElement.clientHeight ||
        !this.rippleElement.clientWidth) {
        this.diagonal =
          Math.max(elementBoundingClientRect.height,
            elementBoundingClientRect.width);

        this.rippleElement.style.height = this.diagonal + 'px';
        this.rippleElement.style.width = this.diagonal + 'px';
      }

      x = event.touches[0].clientX -
        elementBoundingClientRect.left - this.diagonal/2;
      y = event.touches[0].clientY -
        elementBoundingClientRect.top - this.diagonal/2;

      this.rippleElement.style.top = y + 'px';
      this.rippleElement.style.left = x + 'px';

      this.rippleElement.classList.add('animate');
    },

    render: function() {
      return (
        React.createElement("button", {className: "material-button"}, 
          React.createElement("span", {className: "ripple-effect"}), 
          this.props.label
        )
      );
    }
  });

  var Input = React.createClass({displayName: "Input",
    render: function() {
      return (
        React.createElement("div", {className: "material-input-wrapper"}, 
          React.createElement("label", null, this.props.label), 
          React.createElement("input", {required: this.props.required ? true : false, name: "{this.props.inputName}"}), 
          this.props.maxLength ? this.renderMaxLengthView() : null
        )
      );
    }
  });


  return {
    RippleButton: RippleButton
  };
})();
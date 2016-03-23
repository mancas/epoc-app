var ep = ep || {};

ep.materialViews = (function() {
  var RippleButton = React.createClass({displayName: "RippleButton",
    propTypes: {
      label: React.PropTypes.string.isRequired
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
    propTypes: {
      label: React.PropTypes.string.isRequired,
      maxLength: React.PropTypes.number,
      required: React.PropTypes.bool
    },

    componentDidMount: function() {
      var input = this.getDOMNode().querySelector("input");
      input.addEventListener("input", this.onInput);
      input.addEventListener("keyup", this.onInput);
    },

    componentWillUnmount: function() {
      var input = this.getDOMNode().querySelector("input");
      input.removeEventListener("input", this.onInput);
      input.removeEventListener("keyup", this.onInput);
    },

    onInput: function() {
      var input = this.getDOMNode().querySelector("input");
      var charCounterElement = this.getDOMNode().querySelector(".material-char-counter");
      if (charCounterElement) {
        charCounterElement.text = String(input.val() || '').length + '/' + this.props.maxLength;
      }
    },

    renderMaxLengthView: function() {
      return (
        React.createElement("div", {class: "material-char-counter"})
      );
    },

    render: function() {
      return (
        React.createElement("div", {className: "material-input-wrapper"}, 
          React.createElement("label", null, this.props.label), 
          React.createElement("input", {required: this.props.required ? true : false, name: "{this.props.inputName}", maxLength: this.props.maxLength}), 
          this.props.maxLength ? this.renderMaxLengthView() : null
        )
      );
    }
  });


  return {
    Input: Input,
    RippleButton: RippleButton
  };
})();
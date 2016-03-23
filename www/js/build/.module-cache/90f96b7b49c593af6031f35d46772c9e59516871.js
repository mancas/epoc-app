var ep = ep || {};

ep.materialViews = (function() {
  var RippleButton = React.createClass({displayName: "RippleButton",
    propTypes: {
      disabled: React.PropTypes.bool,
      extraCSSClass: React.PropTypes.string,
      fullWidth: React.PropTypes.bool,
      handleClick: React.PropTypes.func,
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
      var x, y;
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
      var cssClasses = {
        "material-button": true,
        "btn-full-width": this.props.fullWidth
      };

      if (this.props.extraCSSClass) {
        cssClasses[this.props.extraCSSClass] = true;
      }

      return (
        React.createElement("button", {className: classNames(cssClasses), onClick: this.props.handleClick, disabled: this.props.disabled}, 
          React.createElement("span", {className: "ripple-effect"}), 
          this.props.label
        )
      );
    }
  });

  var Input = React.createClass({displayName: "Input",
    propTypes: {
      inputName: React.PropTypes.string.isRequired,
      isValid: React.PropTypes.func,
      label: React.PropTypes.string.isRequired,
      maxLength: React.PropTypes.number,
      required: React.PropTypes.bool
    },

    getInitialState: function () {
      return {
        invalid: false,
        touched: false,
        focused: false,
        hasValue: false
      }
    },

    componentDidMount: function() {
      var input = this.getDOMNode().querySelector("input");
      input.addEventListener("input", this.renderCharCount);
      input.addEventListener("keyup", this.renderCharCount);
      input.addEventListener("focus", this.onFocus);
      input.addEventListener("blur", this.onBlur);

      // Render char counter if needed at the initialize
      this.renderCharCount();
      this.validateInput();
    },

    componentWillUnmount: function() {
      var input = this.getDOMNode().querySelector("input");
      input.removeEventListener("input", this.renderCharCount);
      input.removeEventListener("keyup", this.renderCharCount);
      input.removeEventListener("focus", this.onBlur);
      input.removeEventListener("blur", this.onBlur);
    },

    onFocus: function() {
      this.setState({
        touched: true,
        focused: true
      });
    },

    onBlur: function() {
      this.setState({
        focused: false
      });
    },

    renderCharCount: function() {
      var input = this.getDOMNode().querySelector("input");
      var charCounterElement = this.getDOMNode().querySelector(".material-char-counter");
      if (charCounterElement) {
        charCounterElement.textContent = String(input.value || '').length + '/' + this.props.maxLength;
      }
      this.validateInput();
    },

    renderMaxLengthView: function() {
      return (
        React.createElement("div", {className: "material-char-counter"})
      );
    },

    validateInput: function () {
      var input = this.getDOMNode().querySelector("input");
      var hasValue = input.value.length !== 0;
      if (input.required && !hasValue) {
        this.setState({
          invalid: true,
          hasValue: hasValue
        });
      } else {
        this.setState({
          invalid: false,
          hasValue: hasValue
        });
      }
console.info(this.stete.invalid);
      this.props.isValid && this.props.isValid(this.state.invalid);
    },

    render: function() {
      var classes = classNames({
        "material-input-wrapper": true,
        "touched": this.state.touched,
        "is-invalid": this.state.invalid,
        "focused": this.state.focused,
        "has-value": this.state.hasValue
      });
      return (
        React.createElement("div", {className: classes}, 
          React.createElement("label", null, this.props.label), 
          React.createElement("input", {className: "form-control", required: this.props.required ? true : false, name: "{this.props.inputName}", maxLength: this.props.maxLength}), 
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
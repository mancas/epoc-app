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
      this.getDOMNode().addEventListener("touchstart", onTouchStart);
    },

    onTouchStart: function(event) {
      var elementBoundingClientRect = this.getDOMNode().getBoundingClientRect();
      var diagonal
      // Stop the previous animation in case of a
      // quick double click
      this.rippleElement.classList.remove('animate');

      // If it's the first time the user click the button,
      // width and height parameters must be set
      if (!this.rippleElement.clientHeight ||
        !this.rippleElement.clientWidth) {
        diagonal =
          Math.max(elementBoundingClientRect.height,
            elementBoundingClientRect.width);

        this.rippleElement.style.height = diagonal + 'px';
        this.rippleElement.style.width = diagonal + 'px';
      }

      x = evt.touches[0].clientX -
        elementBoundingClientRect.left - diagonal/2;
      y = evt.touches[0].clientY -
        elementBoundingClientRect.top - diagonal/2;

      rippleElement.style.top = y + 'px';
      rippleElement.style.left = x + 'px';

      rippleElement.classList.add('animate');
    }
  });
})();
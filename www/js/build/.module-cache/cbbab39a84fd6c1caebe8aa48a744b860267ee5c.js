var ep = ep || {};

ep.materialViews = (function() {
  var RippleButton = React.createClass({displayName: "RippleButton",
    propTypes: {
      label: React.PropTypes.string
    },

    rippleElement: null,

    componentDidMount: function() {
      this.rippleElement = this.getDOMNode().querySelector(".ripple-effect");
      this.getDOMNode().addEventListener("touchstart", onTouchStart);
    },

    onTouchStart: function(event) {

    }
  });
})();
define(["build/materialViews"], function(materialViews) {
  "use strict";

  var SlideshowView = React.createClass({displayName: "SlideshowView",
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired
    },

    next: function() {
      this.setState({
        currentSlide: this.state.currentSlide + 1
      });
    },

    getInitialState: function() {
      return {
        currentSlide: 0
      };
    },

    render: function() {
      return (
        React.createElement("div", {className: "slideshow"}, 
          
            slideshowData.slides.map(function(slideNode, index) {
              return (
                React.createElement(Slide, {
                  currentSlide: this.state.currentSlide, 
                  index: index, 
                  key: index, 
                  nextSlide: this.next, 
                  slide: slideNode})
              );
            }, this)
          
        )
      );
    }
  });

  var Slide = React.createClass({displayName: "Slide",
    propTypes: {
      index: React.PropTypes.number.isRequired,
      currentSlide: React.PropTypes.number.isRequired,
      nextSlide: React.PropTypes.func.isRequired,
      slide: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {
        visited: false,
        isValid: true
      };
    },

    componentWillReceiveProps: function() {
      if (this.state.visited) {
        return;
      }

      this.setState({
        visited: this.props.currentSlide === this.props.index
      });
    },

    isValid: function(isValid) {
      switch (this.props.slide.type) {
        case "input":
        case "choice":
          this.setState({
            isValid: isValid
          });
          break;
        default:
          return this.setState({
            isValid: true
          });
      }
    },

    renderInputSlide: function() {
      return (
        React.createElement(materialViews.Input, {
          inputName: this.props.slide.question.field.fieldName, 
          isValid: this.isValid, 
          label: this.props.slide.question.field.label, 
          maxLength: this.props.slide.question.field.maxLength, 
          required: this.props.slide.question.field.required})
      );
    },

    renderDecisionSlide: function() {
      return (
        null
      );
    },

    renderChoiceSlide: function() {
      return (
        React.createElement(epocViews.ChoicesView, {
          choiceName: this.props.slide.question.fieldName, 
          choices: this.props.slide.question.choices})
      );
    },

    render: function() {
      var id = "slide-" + this.props.index;
      var slideContent = null;
      switch (this.props.slide.type) {
        case "input":
          slideContent = this.renderInputSlide();
          break;
        case "decision":
          slideContent = this.renderDecisionSlide();
          break;
        case "choice":
          slideContent = this.renderChoiceSlide();
          break;
        default:
          break;
      }

      var cssClasses = {
        "slide": true,
        "current": this.props.currentSlide === this.props.index,
        "done": this.state.visited
      };

      return (
        React.createElement("section", {className: classNames(cssClasses), id: id}, 
          React.createElement("div", {className: "slide-content"}, 
            React.createElement("span", {className: "slide-icon"}), 
            React.createElement("h1", null, this.props.slide.title), 
            React.createElement("p", null, this.props.slide.text), 
            slideContent, 
            
              this.props.slide.buttons.map(function(button, index) {
                return (
                  React.createElement(materialViews.RippleButton, {
                    disabled: !this.state.isValid, 
                    extraCSSClass: button.className, 
                    fullWidth: button.fullWidth, 
                    handleClick: this.props.nextSlide, 
                    key: index, 
                    label: button.label})
                );
              }, this)
            
          )
        )
      );
    }
  });

  return {
    Slide: Slide,
    SlideshowView: SlideshowView
  };
});

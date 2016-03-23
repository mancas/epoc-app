var ep = ep || {};

ep.app = (function() {
  "use strict";

  var Link = ReactRouter.Link;
  var Route = ReactRouter.Route;
  var Router = ReactRouter.Router;
  var materialViews = ep.materialViews;
  var slideshowData = ep.slideshowData;

  var Slideshow = React.createClass({displayName: "Slideshow",
    next: function() {
      this.setState({
        currentSlide: this.state.currentSlide++
      });
    },

    getInitialState: function() {
      return {
        currentSlide: 0
      }
    },

    render: function() {
      return (
        React.createElement("div", {className: "slideshow"}, 
          
            slideshowData.slides.map(function(slideNode, index) {
              return (
                React.createElement(Slide, {
                  key: index, 
                  currentSlide: this.state.currentSlide, 
                  index: index, 
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

    isValid: function(valid) {
      switch(this.props.slide.type) {
        case 'input':
        case 'choice':
          return valid;
        default:
          return true;
      }
    },

    renderInputSlide: function() {
      return (
        React.createElement(materialViews.Input, {
          inputName: this.props.slide.question.field.fieldName, 
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
        null
      );
    },

    render: function() {
      var id = "slide-" + this.props.index;
      var slideContent = null;
      switch(this.props.slide.type) {
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
        "current": this.props.currentSlide === this.props.index
      };

      return (
        React.createElement("section", {id: id, className: classNames(cssClasses)}, 
          React.createElement("div", {className: "slide-content"}, 
            React.createElement("span", {className: "slide-icon"}), 
            React.createElement("h1", null, this.props.slide.title), 
            React.createElement("p", null, this.props.slide.text), 
            slideContent, 
            
              this.props.slide.buttons.map(function (button, index) {
                return React.createElement(materialViews.RippleButton, {
                          key: index, 
                          extraCSSClass: button.className, 
                          fullWidth: button.fullWidth, 
                          handleClick: this.props.nextSlide, 
                          label: button.label})
              }, this)
            
          )
        )
      );
    }
  });

  var Header = React.createClass({displayName: "Header",
    render: function() {
      return React.createElement("header", null, "I'm a header");
    }
  });

  var App = React.createClass({displayName: "App",
    render: function() {
      return (
        React.createElement("div", {className: "app"}, 
          React.createElement(Slideshow, null), 

          React.createElement("div", {className: "page"}, 
            this.props.children
          )
        )
      );
    }
  });

  var AboutPage = React.createClass({displayName: "AboutPage",
    render: function() {
      return (
        React.createElement("div", {className: "about"}, 
          "About page", 
          React.createElement(materialViews.RippleButton, {label: "Continue"}), 
          React.createElement(materialViews.Input, {label: "Name", maxLength: 30, required: true})
        )
      );
    }
  });

  React.render((
    React.createElement(Router, null, 
      React.createElement(Route, {path: "/", component: App}, 
        React.createElement(Route, {path: "about", component: AboutPage}), 
        React.createElement(Route, {path: "*", component: AboutPage})
      )
    )
  ), document.querySelector('#container'));

  return {
    App: App
  }
})();